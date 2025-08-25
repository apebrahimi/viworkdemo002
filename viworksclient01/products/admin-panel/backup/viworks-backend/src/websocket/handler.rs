use actix::{Actor, StreamHandler, AsyncContext, Handler};
use actix_web_actors::ws;
use serde::{Deserialize, Serialize};
use std::time::{Duration, Instant};
use uuid::Uuid;
use crate::websocket::{WebSocketSession, WebSocketSessionManager, WebSocketMessage, WebSocketEvent};

const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(30);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(60);

#[derive(Debug, Serialize, Deserialize)]
pub struct WebSocketActor {
    pub session: WebSocketSession,
    pub session_manager: actix::Addr<WebSocketSessionManager>,
    pub hb: Instant,
}

impl Actor for WebSocketActor {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        // Start heartbeat
        ctx.run_interval(Duration::from_secs(30), |act, ctx| {
            if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
                log::warn!("WebSocket heartbeat failed, disconnecting");
                ctx.stop();
                return;
            }
            ctx.ping(b"");
        });

        // Register with session manager
        self.session_manager.do_send(WebSocketEvent::Connect(self.session.clone()));
    }

    fn stopped(&mut self, _: &mut Self::Context) {
        // Unregister from session manager
        self.session_manager.do_send(WebSocketEvent::Disconnect(self.session.id));
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WebSocketActor {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Text(text)) => {
                log::info!("Sending WebSocket message: {}", msg);
                if let Ok(ws_msg) = serde_json::from_str::<WebSocketMessage>(&text) {
                    self.handle_message(ws_msg, ctx);
                }
            }
            Ok(ws::Message::Binary(bin)) => {
                log::info!("Received binary message: {} bytes", bin.len());
            }
            Ok(ws::Message::Close(reason)) => {
                log::info!("WebSocket closing: {:?}", reason);
                ctx.stop();
            }
            _ => {}
        }
    }
}

impl WebSocketActor {
    fn handle_message(&mut self, msg: WebSocketMessage, ctx: &mut ws::WebsocketContext<Self>) {
        match msg {
            WebSocketMessage::Connect { user_id } => {
                self.session.user_id = Some(user_id);
                log::info!("User {} connected to WebSocket", self.session.user_id.as_ref().unwrap());
            }
            WebSocketMessage::Subscribe { channel } => {
                self.session.subscriptions.insert(channel.clone());
                log::info!("Session {} subscribed to channel: {}", self.session.id, channel);
            }
            WebSocketMessage::Unsubscribe { channel } => {
                self.session.subscriptions.remove(&channel);
                log::info!("Session {} unsubscribed from channel: {}", self.session.id, channel);
            }
            WebSocketMessage::Disconnect => {
                log::info!("Session {} requested disconnect", self.session.id);
                ctx.stop();
            }
            WebSocketMessage::Unknown { .. } => {
                log::warn!("Unknown WebSocket message: {:?}", msg);
            }
        }
    }
}

impl Handler<WebSocketMessage> for WebSocketActor {
    type Result = ();

    fn handle(&mut self, msg: WebSocketMessage, ctx: &mut Self::Context) {
        match serde_json::to_string(&msg) {
            Ok(text) => {
                ctx.text(text);
            }
            Err(e) => {
                log::error!("Failed to parse WebSocket message: {}", e);
            }
        }
    }
}

// WebSocket route handler
pub async fn websocket_route(
    req: actix_web::HttpRequest,
    stream: actix_web::web::Payload,
    session_manager: actix_web::web::Data<WebSocketSessionManager>,
) -> Result<actix_web::HttpResponse, actix_web::Error> {
    let session_manager = session_manager.get_ref().clone();
    
    ws::start(
        WebSocketActor {
            session: WebSocketSession::new(),
            session_manager: session_manager.clone(),
            hb: Instant::now(),
        },
        &req,
        stream,
    )
}
