use actix::{Actor, StreamHandler, AsyncContext, ActorContext};
use actix_web_actors::ws;
use std::time::{Duration, Instant};

const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(30);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(60);

#[derive(Debug)]
pub struct WebSocketActor {
    pub hb: Instant,
}

impl Actor for WebSocketActor {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        // Start heartbeat
        ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
            if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
                log::warn!("WebSocket heartbeat failed, disconnecting");
                ctx.stop();
                return;
            }
            
            // Send ping
            ctx.ping(b"");
        });
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WebSocketActor {
    fn handle(
        &mut self,
        msg: Result<ws::Message, ws::ProtocolError>,
        ctx: &mut Self::Context,
    ) {
        match msg {
            Ok(ws::Message::Ping(msg)) => {
                self.hb = Instant::now();
                ctx.pong(&msg);
            }
            Ok(ws::Message::Pong(_)) => {
                self.hb = Instant::now();
            }
            Ok(ws::Message::Text(text)) => {
                log::info!("Received WebSocket message: {}", text);
                // Echo the message back
                ctx.text(text);
            }
            Ok(ws::Message::Binary(bin)) => {
                log::info!("Received binary message of {} bytes", bin.len());
                ctx.binary(bin);
            }
            Ok(ws::Message::Close(reason)) => {
                log::info!("WebSocket closing: {:?}", reason);
                ctx.stop();
            }
            _ => {}
        }
    }
}

// WebSocket route handler
pub async fn websocket_route(
    req: actix_web::HttpRequest,
    stream: actix_web::web::Payload,
) -> Result<actix_web::HttpResponse, actix_web::Error> {
    ws::start(
        WebSocketActor {
            hb: Instant::now(),
        },
        &req,
        stream,
    )
}
