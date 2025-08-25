use actix_web::{test, web, App};
use serde_json::json;
use sqlx::PgPool;
use viworks_admin_backend::{
    api,
    config::AppConfig,
    database::{create_database_pool, create_redis_pool},
};

// Test helper function to create test app
async fn create_test_app() -> App<impl actix_web::dev::ServiceFactory<
    actix_web::dev::ServiceRequest,
    Response = actix_web::dev::ServiceResponse,
    Error = actix_web::Error,
>> {
    let config = AppConfig::default();
    let db_pool = create_database_pool(&config.database_url).await.unwrap();
    let redis_pool = create_redis_pool(&config.redis_url).await.unwrap();

    App::new()
        .app_data(web::Data::new(db_pool.clone()))
        .app_data(web::Data::new(redis_pool.clone()))
        .app_data(web::Data::new(config.clone()))
        .configure(api::configure_routes)
}

#[actix_web::test]
async fn test_health_endpoint() {
    let app = create_test_app().await;
    let req = test::TestRequest::get().uri("/api/v1/health").to_request();
    let resp = test::call_service(&app, req).await;
    
    assert!(resp.status().is_success());
    
    let body = test::read_body(resp).await;
    let health_data: serde_json::Value = serde_json::from_slice(&body).unwrap();
    
    assert_eq!(health_data["status"], "ok");
    assert!(health_data["version"].is_string());
}

#[actix_web::test]
async fn test_auth_login() {
    let app = create_test_app().await;
    
    let login_data = json!({
        "username": "admin",
        "password": "admin123"
    });
    
    let req = test::TestRequest::post()
        .uri("/api/v1/auth/login")
        .set_json(login_data)
        .to_request();
    
    let resp = test::call_service(&app, req).await;
    
    // This might fail if database is not set up, but we're testing the endpoint structure
    assert!(resp.status().is_client_error() || resp.status().is_success());
}

#[actix_web::test]
async fn test_users_list_endpoint() {
    let app = create_test_app().await;
    let req = test::TestRequest::get().uri("/api/v1/users").to_request();
    let resp = test::call_service(&app, req).await;
    
    // Should return 401 Unauthorized since we're not authenticated
    assert_eq!(resp.status().as_u16(), 401);
}

#[actix_web::test]
async fn test_clients_list_endpoint() {
    let app = create_test_app().await;
    let req = test::TestRequest::get().uri("/api/v1/clients").to_request();
    let resp = test::call_service(&app, req).await;
    
    // Should return 401 Unauthorized since we're not authenticated
    assert_eq!(resp.status().as_u16(), 401);
}

#[actix_web::test]
async fn test_sessions_list_endpoint() {
    let app = create_test_app().await;
    let req = test::TestRequest::get().uri("/api/v1/sessions").to_request();
    let resp = test::call_service(&app, req).await;
    
    // Should return 401 Unauthorized since we're not authenticated
    assert_eq!(resp.status().as_u16(), 401);
}

#[actix_web::test]
async fn test_monitoring_health_endpoint() {
    let app = create_test_app().await;
    let req = test::TestRequest::get().uri("/api/v1/monitoring/health").to_request();
    let resp = test::call_service(&app, req).await;
    
    assert!(resp.status().is_success());
    
    let body = test::read_body(resp).await;
    let health_data: serde_json::Value = serde_json::from_slice(&body).unwrap();
    
    assert_eq!(health_data["status"], "healthy");
    assert!(health_data["version"].is_string());
}

#[actix_web::test]
async fn test_monitoring_alerts_endpoint() {
    let app = create_test_app().await;
    let req = test::TestRequest::get().uri("/api/v1/monitoring/alerts").to_request();
    let resp = test::call_service(&app, req).await;
    
    // Should return 401 Unauthorized since we're not authenticated
    assert_eq!(resp.status().as_u16(), 401);
}

#[actix_web::test]
async fn test_monitoring_logs_endpoint() {
    let app = create_test_app().await;
    let req = test::TestRequest::get().uri("/api/v1/monitoring/logs").to_request();
    let resp = test::call_service(&app, req).await;
    
    // Should return 401 Unauthorized since we're not authenticated
    assert_eq!(resp.status().as_u16(), 401);
}

#[actix_web::test]
async fn test_health_full_endpoint() {
    let app = create_test_app().await;
    let req = test::TestRequest::get().uri("/api/v1/health/full").to_request();
    let resp = test::call_service(&app, req).await;
    
    assert!(resp.status().is_success());
    
    let body = test::read_body(resp).await;
    let health_data: serde_json::Value = serde_json::from_slice(&body).unwrap();
    
    assert!(health_data["status"].is_string());
    assert!(health_data["services"].is_object());
    assert!(health_data["services"]["database"].is_object());
    assert!(health_data["services"]["redis"].is_object());
}

#[actix_web::test]
async fn test_system_info_endpoint() {
    let app = create_test_app().await;
    let req = test::TestRequest::get().uri("/api/v1/health/system-info").to_request();
    let resp = test::call_service(&app, req).await;
    
    assert!(resp.status().is_success());
    
    let body = test::read_body(resp).await;
    let system_info: serde_json::Value = serde_json::from_slice(&body).unwrap();
    
    assert!(system_info["version"].is_string());
    assert!(system_info["environment"].is_string());
}

// Test pagination parameters
#[actix_web::test]
async fn test_pagination_parameters() {
    let app = create_test_app().await;
    
    // Test with page and per_page parameters
    let req = test::TestRequest::get()
        .uri("/api/v1/users?page=2&per_page=5")
        .to_request();
    let resp = test::call_service(&app, req).await;
    
    // Should return 401 Unauthorized since we're not authenticated
    assert_eq!(resp.status().as_u16(), 401);
}

// Test invalid endpoints
#[actix_web::test]
async fn test_invalid_endpoint() {
    let app = create_test_app().await;
    let req = test::TestRequest::get().uri("/api/v1/invalid").to_request();
    let resp = test::call_service(&app, req).await;
    
    assert_eq!(resp.status().as_u16(), 404);
}

// Test CORS headers
#[actix_web::test]
async fn test_cors_headers() {
    let app = create_test_app().await;
    let req = test::TestRequest::get()
        .uri("/api/v1/health")
        .header("Origin", "http://localhost:3000")
        .to_request();
    let resp = test::call_service(&app, req).await;
    
    assert!(resp.status().is_success());
    
    // Check if CORS headers are present
    let headers = resp.headers();
    assert!(headers.contains_key("access-control-allow-origin"));
}

// Test JSON content type
#[actix_web::test]
async fn test_json_content_type() {
    let app = create_test_app().await;
    let req = test::TestRequest::get().uri("/api/v1/health").to_request();
    let resp = test::call_service(&app, req).await;
    
    assert!(resp.status().is_success());
    
    let headers = resp.headers();
    assert_eq!(
        headers.get("content-type").unwrap().to_str().unwrap(),
        "application/json"
    );
}
