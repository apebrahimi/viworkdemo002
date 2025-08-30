use crate::Result;
use tracing_subscriber::{
    fmt::{format::FmtSpan, time::LocalTime},
    layer::SubscriberExt,
    util::SubscriberInitExt,
    EnvFilter,
};
use std::sync::Once;

static INIT: Once = Once::new();

pub fn init_logging() -> Result<()> {
    INIT.call_once(|| {
        let log_dir = crate::config::AppConfig::get_log_dir()
            .expect("Failed to get log directory");
        
        let file_appender = tracing_appender::rolling::RollingFileAppender::builder()
            .rotation(tracing_appender::rolling::Rotation::DAILY)
            .filename_prefix("viworks")
            .filename_suffix("log")
            .build(&log_dir)
            .expect("Failed to create log file appender");

        let (non_blocking, _guard) = tracing_appender::non_blocking(file_appender);

        tracing_subscriber::registry()
            .with(EnvFilter::from_default_env())
            .with(
                tracing_subscriber::fmt::layer()
                    .with_timer(LocalTime::rfc_3339())
                    .with_span_events(FmtSpan::CLOSE)
                    .with_target(false)
                    .with_thread_ids(true)
                    .with_thread_names(true)
            )
            .with(
                tracing_subscriber::fmt::layer()
                    .with_timer(LocalTime::rfc_3339())
                    .with_span_events(FmtSpan::CLOSE)
                    .with_target(false)
                    .with_thread_ids(true)
                    .with_thread_names(true)
                    .with_writer(non_blocking)
            )
            .init();
    });

    Ok(())
}

pub fn redact_secrets(text: &str) -> String {
    // Simple redaction - replace potential secrets with [REDACTED]
    let patterns = [
        r"password\s*=\s*\S+",
        r"key\s*=\s*\S+",
        r"hmac\s*=\s*\S+",
        r"token\s*=\s*\S+",
        r"secret\s*=\s*\S+",
    ];

    let mut redacted = text.to_string();
    for pattern in &patterns {
        if let Ok(regex) = regex::Regex::new(pattern) {
            redacted = regex.replace_all(&redacted, "[REDACTED]").into_owned();
        }
    }

    redacted
}
