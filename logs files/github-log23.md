step 1: 
Test Backend Agent
succeeded 1 minute ago in 54s

1s
Current runner version: '2.328.0'
Runner Image Provisioner
Operating System
Runner Image
GITHUB_TOKEN Permissions
Secret source: Actions
Prepare workflow directory
Prepare all required actions
Getting action download info
Download action repository 'actions/checkout@v4' (SHA:08eba0b27e820071cde6df949e0beb9ba4906955)
Download action repository 'dtolnay/rust-toolchain@stable' (SHA:5d458579430fc14a04a08a1e7d3694f545e91ce6)
Download action repository 'actions/cache@v3' (SHA:2f8e54208210a422b2efd51efaa6bd6d7ca8920f)
Complete job name: Test Backend Agent
1s
Run actions/checkout@v4
Syncing repository: apebrahimi/viworkdemo002
Getting Git version info
Temporarily overriding HOME='/home/runner/work/_temp/33f4c90d-2c6c-4f6c-8b30-3f14831a98b3' before making global git config changes
Adding repository directory to the temporary git global config as a safe directory
/usr/bin/git config --global --add safe.directory /home/runner/work/viworkdemo002/viworkdemo002
Deleting the contents of '/home/runner/work/viworkdemo002/viworkdemo002'
Initializing the repository
Disabling automatic garbage collection
Setting up auth
Fetching the repository
Determining the checkout info
/usr/bin/git sparse-checkout disable
/usr/bin/git config --local --unset-all extensions.worktreeConfig
Checking out the ref
/usr/bin/git log -1 --format=%H
f6461d8be73871f5de720a5933e3f1005a4486be
3s
Run dtolnay/rust-toolchain@stable
Run : parse toolchain version
Run : construct rustup command line
Run : set $CARGO_HOME
Run : install rustup if needed
Run rustup toolchain install stable --component rustfmt --component clippy --profile minimal --no-self-update
info: syncing channel updates for 'stable-x86_64-unknown-linux-gnu'
info: latest update on 2025-08-07, rust version 1.89.0 (29483883e 2025-08-04)
info: component 'clippy' for target 'x86_64-unknown-linux-gnu' is up to date
info: component 'rustfmt' for target 'x86_64-unknown-linux-gnu' is up to date

  stable-x86_64-unknown-linux-gnu unchanged - rustc 1.89.0 (29483883e 2025-08-04)

Run rustup default stable
info: using existing install for 'stable-x86_64-unknown-linux-gnu'
info: default toolchain set to 'stable-x86_64-unknown-linux-gnu'

  stable-x86_64-unknown-linux-gnu unchanged - rustc 1.89.0 (29483883e 2025-08-04)

Run : create cachekey
Run : disable incremental compilation
Run : enable colors in Cargo output
Run : enable Cargo sparse registry
Run : work around spurious network errors in curl 8.0
Run rustc +stable --version --verbose
rustc 1.89.0 (29483883e 2025-08-04)
binary: rustc
commit-hash: 29483883eed69d5fb4db01964cdf2af4d86e9cb2
commit-date: 2025-08-04
host: x86_64-unknown-linux-gnu
release: 1.89.0
LLVM version: 20.1.7
14s
Run actions/cache@v3
Cache hit for: Linux-cargo-0e17d64bec7e0b6bd0aa227fa06120aa97a87289cb926d622a12fe56b19f6a4f
Received 16777216 of 578897293 (2.9%), 16.0 MBs/sec
Received 130023424 of 578897293 (22.5%), 61.9 MBs/sec
Received 163577856 of 578897293 (28.3%), 52.0 MBs/sec
Received 264241152 of 578897293 (45.6%), 63.0 MBs/sec
Received 377487360 of 578897293 (65.2%), 72.0 MBs/sec
Received 452984832 of 578897293 (78.2%), 72.0 MBs/sec
Received 532676608 of 578897293 (92.0%), 72.6 MBs/sec
Received 574702989 of 578897293 (99.3%), 68.5 MBs/sec
Received 578897293 of 578897293 (100.0%), 66.3 MBs/sec
Cache Size: ~552 MB (578897293 B)
/usr/bin/tar -xf /home/runner/work/_temp/799a7b3b-b5be-45bd-930e-0670634e8fed/cache.tzst -P -C /home/runner/work/viworkdemo002/viworkdemo002 --use-compress-program unzstd
Cache restored successfully
Cache restored from key: Linux-cargo-0e17d64bec7e0b6bd0aa227fa06120aa97a87289cb926d622a12fe56b19f6a4f
31s
Run cd "backend agent"
       Fresh unicode-ident v1.0.18
       Fresh cfg-if v1.0.3
       Fresh proc-macro2 v1.0.101
       Fresh autocfg v1.5.0
       Fresh find-msvc-tools v0.1.0
       Fresh quote v1.0.40
       Fresh libc v0.2.175
       Fresh shlex v1.3.0
       Fresh pin-project-lite v0.2.16
       Fresh syn v2.0.106
       Fresh jobserver v0.1.34
       Fresh once_cell v1.21.3
       Fresh cc v1.2.35
       Fresh serde_derive v1.0.219
       Fresh memchr v2.7.5
       Fresh serde v1.0.219
       Fresh smallvec v1.15.1
       Fresh version_check v0.9.5
       Fresh bytes v1.10.1
       Fresh futures-core v0.3.31
       Fresh getrandom v0.2.16
       Fresh zerocopy v0.8.26
       Fresh scopeguard v1.2.0
       Fresh synstructure v0.13.2
       Fresh parking_lot_core v0.9.11
       Fresh lock_api v0.4.13
       Fresh socket2 v0.6.0
       Fresh zerofrom-derive v0.1.6
       Fresh parking_lot v0.12.4
       Fresh zerofrom v0.1.6
       Fresh yoke-derive v0.8.0
       Fresh stable_deref_trait v1.2.0
       Fresh yoke v0.8.0
       Fresh itoa v1.0.15
       Fresh zerovec-derive v0.11.1
       Fresh displaydoc v0.2.5
       Fresh zerovec v0.11.4
       Fresh tokio-macros v2.5.0
       Fresh signal-hook-registry v1.4.6
       Fresh tracing-attributes v0.1.30
       Fresh pin-utils v0.1.0
       Fresh futures-task v0.3.31
       Fresh slab v0.4.11
       Fresh futures-io v0.3.31
       Fresh typenum v1.18.0
       Fresh tinystr v0.8.1
       Fresh litemap v0.8.0
       Fresh writeable v0.6.1
       Fresh generic-array v0.14.7
       Fresh icu_locale_core v2.0.0
       Fresh potential_utf v0.1.3
       Fresh zerotrie v0.2.2
       Fresh icu_provider v2.0.0
       Fresh icu_collections v2.0.0
       Fresh percent-encoding v2.3.2
       Fresh fnv v1.0.7
       Fresh untrusted v0.9.0
       Fresh icu_properties_data v2.0.1
       Fresh icu_normalizer_data v2.0.0
       Fresh block-buffer v0.10.4
       Fresh crypto-common v0.1.6
       Fresh equivalent v1.0.2
       Fresh subtle v2.6.1
       Fresh pkg-config v0.3.32
       Fresh hashbrown v0.15.5
       Fresh digest v0.10.7
       Fresh icu_properties v2.0.1
       Fresh indexmap v2.11.0
       Fresh icu_normalizer v2.0.0
       Fresh ppv-lite86 v0.2.21
       Fresh futures-macro v0.3.31
       Fresh idna_adapter v1.2.1
       Fresh ryu v1.0.20
       Fresh utf8_iter v1.0.4
       Fresh cpufeatures v0.2.17
       Fresh allocator-api2 v0.2.21
       Fresh serde_json v1.0.143
       Fresh http v0.2.12
       Fresh rand_core v0.6.4
       Fresh rand_chacha v0.3.1
       Fresh tokio-util v0.7.16
       Fresh tracing-core v0.1.34
       Fresh log v0.4.28
       Fresh base64 v0.21.7
       Fresh tracing v0.1.41
       Fresh syn v1.0.109
       Fresh httparse v1.10.1
       Fresh thiserror-impl v1.0.69
       Fresh vcpkg v0.2.15
       Fresh minimal-lexical v0.2.1
       Fresh nom v7.1.3
       Fresh thiserror v1.0.69
       Fresh getrandom v0.3.3
       Fresh thiserror-impl v2.0.16
       Fresh iana-time-zone v0.1.63
       Fresh webpki-roots v0.25.4
       Fresh thiserror v2.0.16
       Fresh crossbeam-utils v0.8.21
       Fresh ring v0.17.14
       Fresh rustls-pemfile v1.0.4
       Fresh h2 v0.3.27
       Fresh sha2 v0.10.9
       Fresh aho-corasick v1.1.3
       Fresh socket2 v0.5.10
       Fresh crc-catalog v2.4.0
       Fresh time-core v0.1.6
       Fresh num-conv v0.1.0
       Fresh unicode_categories v0.1.1
       Fresh httpdate v1.0.3
       Fresh powerfmt v0.2.0
       Fresh hex v0.4.3
       Fresh tinyvec_macros v0.1.1
       Fresh regex-syntax v0.8.6
       Fresh tinyvec v1.10.0
       Fresh deranged v0.5.3
       Fresh regex-automata v0.4.10
       Fresh time-macros v0.2.24
       Fresh sqlformat v0.2.6
       Fresh crc v3.3.0
       Fresh crossbeam-queue v0.3.12
       Fresh paste v1.0.15
       Fresh crunchy v0.2.4
       Fresh num-traits v0.2.19
       Fresh ahash v0.8.12
       Fresh hmac v0.12.1
       Fresh futures-intrusive v0.5.0
       Fresh bytestring v1.4.0
       Fresh either v1.15.0
       Fresh mio v1.0.4
       Fresh encoding_rs v0.8.35
       Fresh alloc-no-stdlib v2.0.4
       Fresh local-waker v0.1.4
       Fresh ident_case v1.0.1
       Fresh futures-sink v0.3.31
       Fresh strsim v0.10.0
       Fresh event-listener v2.5.3
       Fresh darling_core v0.13.4
       Fresh alloc-stdlib v0.2.2
       Fresh tokio v1.47.1
       Fresh hashbrown v0.14.5
       Fresh tiny-keccak v2.0.2
       Fresh time v0.3.43
       Fresh unicode-normalization v0.1.24
       Fresh sct v0.7.1
       Fresh rustls-webpki v0.101.7
       Fresh zstd-sys v2.0.15+zstd.1.5.7
       Fresh sha1 v0.10.6
       Fresh idna v1.1.0
       Fresh rand_core v0.9.3
       Fresh form_urlencoded v1.2.2
       Fresh actix-macros v0.2.4
       Fresh ucd-trie v0.1.7
       Fresh foreign-types-shared v0.1.1
       Fresh adler2 v2.0.1
       Fresh bitflags v2.9.4
       Fresh unicode-bidi v0.3.18
       Fresh unicode-properties v0.1.3
       Fresh base64 v0.22.1
       Fresh unicode-xid v0.2.6
       Fresh unicode-segmentation v1.12.0
       Fresh regex-lite v0.1.7
       Fresh stringprep v0.1.5
       Fresh derive_more-impl v2.0.1
       Fresh miniz_oxide v0.8.9
       Fresh foreign-types v0.3.2
       Fresh pest v2.8.1
       Fresh url v2.5.7
       Fresh rand_chacha v0.9.0
       Fresh actix-rt v2.11.0
       Fresh rustls v0.21.12
       Fresh zstd-safe v7.2.4
       Fresh const-random-macro v0.1.16
       Fresh brotli-decompressor v5.0.0
       Fresh crc32fast v1.5.0
       Fresh darling_macro v0.13.4
       Fresh futures-util v0.3.31
       Fresh futures-channel v0.3.31
       Fresh actix-utils v3.0.1
       Fresh hkdf v0.12.4
       Fresh openssl-sys v0.9.109
       Fresh hashlink v0.8.4
       Fresh md-5 v0.10.6
       Fresh actix-service v2.0.3
       Fresh openssl-macros v0.1.1
       Fresh linux-raw-sys v0.9.4
       Fresh home v0.5.11
       Fresh dotenvy v0.15.7
       Fresh try-lock v0.2.5
       Fresh byteorder v1.5.0
       Fresh whoami v1.6.1
       Fresh anstyle v1.0.11
       Fresh mime v0.3.17
       Fresh want v0.3.1
       Fresh openssl v0.10.73
       Fresh rustix v1.0.8
       Fresh darling v0.13.4
       Fresh brotli v8.0.2
       Fresh flate2 v1.1.2
       Fresh const-random v0.1.18
       Fresh zstd v0.13.3
       Fresh rand v0.9.2
       Fresh pest_meta v2.8.1
       Fresh derive_more v2.0.1
       Fresh local-channel v0.1.5
       Fresh regex v1.11.2
       Fresh actix-codec v0.5.2
       Fresh serde_urlencoded v0.7.1
       Fresh rand v0.8.5
       Fresh http-body v0.4.6
       Fresh tokio-stream v0.1.17
       Fresh language-tags v0.3.2
       Fresh tower-service v0.3.3
       Fresh foldhash v0.1.5
       Fresh utf8parse v0.2.2
       Fresh openssl-probe v0.1.6
       Fresh fastrand v2.3.0
       Fresh anstyle-parse v0.2.7
       Fresh actix-http v3.11.1
       Fresh tempfile v3.21.0
       Fresh native-tls v0.2.14
       Fresh hyper v0.14.32
       Fresh actix-router v0.5.3
       Fresh actix-web-codegen v4.3.0
       Fresh pest_generator v2.8.1
       Fresh dlv-list v0.5.2
       Fresh cookie v0.16.2
       Fresh serde_with_macros v1.5.2
       Fresh actix-server v2.6.0
       Fresh heck v0.4.1
       Fresh tokio-rustls v0.24.1
       Fresh chrono v0.4.41
       Fresh num-integer v0.1.46
       Fresh atoi v2.0.0
       Fresh futures-executor v0.3.31
       Fresh uuid v1.18.1
       Fresh toml_datetime v0.6.11
       Fresh serde_spanned v0.6.9
       Fresh pin-project-internal v1.1.10
       Fresh impl-more v0.1.9
       Fresh anstyle-query v1.1.4
       Fresh winnow v0.7.13
       Fresh predicates-core v1.0.9
       Fresh colorchoice v1.0.4
       Fresh toml_write v0.1.2
       Fresh is_terminal_polyfill v1.70.1
       Fresh lazy_static v1.5.0
       Fresh toml_edit v0.22.27
       Fresh anstream v0.6.20
       Fresh actix-web v4.11.0
       Fresh pin-project v1.1.10
       Fresh num-bigint v0.4.6
       Fresh futures v0.3.31
       Fresh sqlx-core v0.7.4
       Fresh sqlx-macros-core v0.7.4
       Fresh serde_with v1.14.0
       Fresh pest_derive v2.8.1
       Fresh ordered-multimap v0.7.3
       Fresh tokio-native-tls v0.3.1
       Fresh async-trait v0.1.89
       Fresh async-stream-impl v0.3.6
       Fresh utf-8 v0.7.6
       Fresh termtree v0.5.1
       Fresh data-encoding v2.9.0
       Fresh heck v0.5.0
       Fresh strsim v0.11.1
       Fresh arraydeque v0.5.1
       Fresh clap_lex v0.7.5
       Fresh predicates-tree v1.0.12
       Fresh clap_builder v4.5.47
       Fresh yaml-rust2 v0.8.1
       Fresh clap_derive v4.5.47
       Fresh tungstenite v0.20.1
       Fresh hyper-tls v0.5.0
       Fresh async-stream v0.3.6
       Fresh json5 v0.4.1
       Fresh rust-ini v0.20.0
       Fresh bollard-stubs v1.42.0-rc.3
       Fresh sqlx-macros v0.7.4
       Fresh tokio-retry v0.3.0
       Fresh sqlx-postgres v0.7.4
       Fresh simple_asn1 v0.6.3
       Fresh crc16 v0.4.0
       Fresh toml v0.8.23
       Fresh sharded-slab v0.1.7
       Fresh predicates v3.1.3
       Fresh hyper-rustls v0.24.2
       Fresh convert_case v0.6.0
       Fresh pem v3.0.5
       Fresh matchers v0.2.0
       Fresh ron v0.8.1
       Fresh combine v4.6.7
       Fresh tracing-log v0.2.0
       Fresh tracing-serde v0.2.0
       Fresh mockall_derive v0.12.1
       Fresh socket2 v0.4.10
       Fresh thread_local v1.1.9
       Fresh nu-ansi-term v0.50.1
       Fresh fragile v2.0.1
       Fresh sync_wrapper v0.1.2
       Fresh arc-swap v1.7.1
       Fresh downcast v0.11.0
       Fresh pathdiff v0.2.3
       Fresh sha1_smol v1.0.1
       Fresh ipnet v2.11.0
       Fresh redis v0.24.0
       Fresh mockall v0.12.1
       Fresh config v0.14.1
       Fresh reqwest v0.11.27
       Fresh tracing-subscriber v0.3.20
       Fresh jsonwebtoken v9.3.1
       Fresh sqlx v0.7.4
       Fresh testcontainers v0.15.0
       Fresh tokio-test v0.4.4
       Fresh anyhow v1.0.99
       Fresh tokio-tungstenite v0.20.1
       Fresh clap v4.5.47
       Fresh actix-web-httpauth v0.8.2
       Fresh actix-cors v0.7.1
       Fresh dashmap v5.5.3
       Fresh num_cpus v1.17.0
       Dirty viworks-backend-agent v0.1.0 (/home/runner/work/viworkdemo002/viworkdemo002/backend agent): the file `src/data/postgres.rs` has changed (1757074296.832570469s, 15h 28m 59s after last build at 1757018557.572450102s)
   Compiling viworks-backend-agent v0.1.0 (/home/runner/work/viworkdemo002/viworkdemo002/backend agent)
     Running `/home/runner/.rustup/toolchains/stable-x86_64-unknown-linux-gnu/bin/rustc --crate-name viworks_backend_agent --edition=2021 src/main.rs --error-format=json --json=diagnostic-rendered-ansi,artifacts,future-incompat --emit=dep-info,link -C embed-bitcode=no -C debuginfo=2 --test --check-cfg 'cfg(docsrs,test)' --check-cfg 'cfg(feature, values())' -C metadata=6fa653e0e6096d47 -C extra-filename=-76c07ce4fbd6ccad --out-dir '/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps' -L 'dependency=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps' --extern 'actix_cors=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libactix_cors-60a3c1c1f9a2a96f.rlib' --extern 'actix_rt=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libactix_rt-318e0dfdacacfb81.rlib' --extern 'actix_web=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libactix_web-ccfd4903698db251.rlib' --extern 'actix_web_httpauth=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libactix_web_httpauth-daa461dbea5139e1.rlib' --extern 'anyhow=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libanyhow-3f246785ad7dfde2.rlib' --extern 'async_trait=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libasync_trait-69988d9f5d88e489.so' --extern 'base64=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libbase64-9aa53967577f990a.rlib' --extern 'chrono=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libchrono-6e04e3f793341704.rlib' --extern 'clap=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libclap-b7a9c838bd32e948.rlib' --extern 'config=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libconfig-b0ab0229476304bd.rlib' --extern 'dashmap=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libdashmap-b67e37c374dfdd3a.rlib' --extern 'futures_util=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libfutures_util-3dc2f14c48f60a0b.rlib' --extern 'jsonwebtoken=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libjsonwebtoken-08d6a29a44bdf784.rlib' --extern 'mockall=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libmockall-bc40d38d14d0a010.rlib' --extern 'num_cpus=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libnum_cpus-7029c5246251e1ca.rlib' --extern 'redis=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libredis-85d21acfb53dcaa0.rlib' --extern 'reqwest=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libreqwest-428240fc7e81e76a.rlib' --extern 'ring=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libring-425887da17da84b5.rlib' --extern 'serde=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libserde-ee257f6e92061072.rlib' --extern 'serde_json=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libserde_json-02b81369b0fe77cc.rlib' --extern 'sha2=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libsha2-96bb199df0a397c6.rlib' --extern 'sqlx=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libsqlx-28dfaeb7fca5d215.rlib' --extern 'testcontainers=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libtestcontainers-fbb478a87ffb20c8.rlib' --extern 'thiserror=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libthiserror-28b3f4f03bffec38.rlib' --extern 'time=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libtime-7769be2a90998ad5.rlib' --extern 'tokio=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libtokio-34b08a24e0e45306.rlib' --extern 'tokio_test=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libtokio_test-bf79e4354ada5d1b.rlib' --extern 'tokio_tungstenite=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libtokio_tungstenite-3674d48a2789e0c5.rlib' --extern 'toml=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libtoml-e6ce4f8d4d75c3c0.rlib' --extern 'tracing=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libtracing-a1d2c5b59b87da50.rlib' --extern 'tracing_subscriber=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libtracing_subscriber-041eb030abf7a6ed.rlib' --extern 'url=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/liburl-4b06b872da0a6703.rlib' --extern 'uuid=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/libuuid-b0ca7ee3b87770b9.rlib' -L 'native=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/build/zstd-sys-168035e151d0c6b0/out' -L 'native=/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/build/ring-8cf62460f8e3afd9/out'`
warning: unused import: `actix_cors::Cors`
 --> src/main.rs:1:5
  |
1 | use actix_cors::Cors;
  |     ^^^^^^^^^^^^^^^^
  |
  = note: `#[warn(unused_imports)]` on by default

warning: unused import: `crate::command::CommandEngine`
 --> src/agent/manager.rs:3:5
  |
3 | use crate::command::CommandEngine;
  |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `crate::telemetry::TelemetryProcessor`
 --> src/agent/manager.rs:8:5
  |
8 | use crate::telemetry::TelemetryProcessor;
  |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused imports: `App`, `HttpServer`, `middleware::Logger`, and `web`
 --> src/agent/manager.rs:9:17
  |
9 | use actix_web::{middleware::Logger, web, App, HttpServer};
  |                 ^^^^^^^^^^^^^^^^^^  ^^^  ^^^  ^^^^^^^^^^

warning: unused import: `std::net::SocketAddr`
  --> src/agent/manager.rs:11:5
   |
11 | use std::net::SocketAddr;
   |     ^^^^^^^^^^^^^^^^^^^^

warning: unused import: `tokio_tungstenite::tungstenite::handshake::server::Callback`
  --> src/agent/manager.rs:16:5
   |
16 | use tokio_tungstenite::tungstenite::handshake::server::Callback;
   |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `WebSocketStream`
  --> src/agent/manager.rs:17:39
   |
17 | use tokio_tungstenite::{accept_async, WebSocketStream};
   |                                       ^^^^^^^^^^^^^^^

warning: unused import: `tokio::sync::RwLock`
 --> src/agent/registry.rs:5:5
  |
5 | use tokio::sync::RwLock;
  |     ^^^^^^^^^^^^^^^^^^^

warning: unused import: `error`
 --> src/agent/registry.rs:6:22
  |
6 | use tracing::{debug, error, info, warn};
  |                      ^^^^^

warning: unused import: `uuid::Uuid`
 --> src/agent/registry.rs:7:5
  |
7 | use uuid::Uuid;
  |     ^^^^^^^^^^

warning: unused import: `info`
 --> src/api/auth.rs:9:29
  |
9 | use tracing::{debug, error, info, warn};
  |                             ^^^^

warning: unused import: `warn`
  --> src/api/handlers.rs:11:35
   |
11 | use tracing::{debug, error, info, warn};
   |                                   ^^^^

warning: unused import: `auth::*`
 --> src/api/mod.rs:5:9
  |
5 | pub use auth::*;
  |         ^^^^^^^

warning: unused import: `handlers::*`
 --> src/api/mod.rs:6:9
  |
6 | pub use handlers::*;
  |         ^^^^^^^^^^^

warning: unused import: `routes::configure_routes`
 --> src/api/mod.rs:7:9
  |
7 | pub use routes::configure_routes;
  |         ^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused imports: `CommandPriority` and `CommandStatus`
 --> src/command/executor.rs:1:27
  |
1 | use crate::data::models::{CommandPriority, CommandRecord, CommandResult, CommandStatus};
  |                           ^^^^^^^^^^^^^^^                                ^^^^^^^^^^^^^

warning: unused import: `serde_json::Value`
 --> src/command/executor.rs:3:5
  |
3 | use serde_json::Value;
  |     ^^^^^^^^^^^^^^^^^

warning: unused import: `std::collections::HashMap`
 --> src/command/executor.rs:4:5
  |
4 | use std::collections::HashMap;
  |     ^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused imports: `debug` and `error`
 --> src/command/executor.rs:5:15
  |
5 | use tracing::{debug, error, info, warn};
  |               ^^^^^  ^^^^^

warning: unused import: `error`
 --> src/command/queue.rs:7:22
  |
7 | use tracing::{debug, error, info, warn};
  |                      ^^^^^

warning: unused import: `uuid::Uuid`
 --> src/command/queue.rs:8:5
  |
8 | use uuid::Uuid;
  |     ^^^^^^^^^^

warning: unused import: `models::*`
 --> src/data/mod.rs:5:9
  |
5 | pub use models::*;
  |         ^^^^^^^^^

warning: unused import: `std::fmt`
 --> src/error.rs:3:5
  |
3 | use std::fmt;
  |     ^^^^^^^^

warning: unused import: `std::collections::HashMap`
 --> src/telemetry/analytics.rs:4:5
  |
4 | use std::collections::HashMap;
  |     ^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `std::sync::Arc`
 --> src/telemetry/analytics.rs:5:5
  |
5 | use std::sync::Arc;
  |     ^^^^^^^^^^^^^^

warning: unused import: `error`
 --> src/telemetry/analytics.rs:6:22
  |
6 | use tracing::{debug, error, info, warn};
  |                      ^^^^^

warning: unused import: `AgentInfo`
 --> src/telemetry/processor.rs:2:27
  |
2 | use crate::data::models::{AgentInfo, NetworkStats, TelemetryMessage, TelemetryRecord};
  |                           ^^^^^^^^^

warning: unused imports: `debug` and `warn`
 --> src/telemetry/processor.rs:9:15
  |
9 | use tracing::{debug, error, info, warn};
  |               ^^^^^               ^^^^

warning: unused import: `std::sync::Arc`
 --> src/telemetry/storage.rs:4:5
  |
4 | use std::sync::Arc;
  |     ^^^^^^^^^^^^^^

warning: unused variable: `registry`
   --> src/agent/manager.rs:145:9
    |
145 |         registry: Arc<AgentRegistry>,
    |         ^^^^^^^^ help: if this is intentional, prefix it with an underscore: `_registry`
    |
    = note: `#[warn(unused_variables)]` on by default

warning: unused variable: `config`
   --> src/agent/manager.rs:149:9
    |
149 |         config: Config,
    |         ^^^^^^ help: if this is intentional, prefix it with an underscore: `_config`

warning: variable does not need to be mutable
   --> src/agent/manager.rs:160:13
    |
160 |         let mut connection = AgentConnection::new(ws_stream);
    |             ----^^^^^^^^^^
    |             |
    |             help: remove this `mut`
    |
    = note: `#[warn(unused_mut)]` on by default

warning: unused variable: `agent_info`
   --> src/agent/manager.rs:190:13
    |
190 |         let agent_info =
    |             ^^^^^^^^^^ help: if this is intentional, prefix it with an underscore: `_agent_info`

warning: unused variable: `config`
   --> src/agent/manager.rs:436:17
    |
436 |             let config = config.clone();
    |                 ^^^^^^ help: if this is intentional, prefix it with an underscore: `_config`

warning: variable does not need to be mutable
   --> src/api/auth.rs:103:17
    |
103 |             let mut req = req;
    |                 ----^^^
    |                 |
    |                 help: remove this `mut`

warning: unused variable: `ws_message`
   --> src/command/engine.rs:136:13
    |
136 |         let ws_message = WebSocketMessage {
    |             ^^^^^^^^^^ help: if this is intentional, prefix it with an underscore: `_ws_message`

warning: unused variable: `config`
   --> src/command/engine.rs:404:13
    |
404 |         let config = self.config.clone();
    |             ^^^^^^ help: if this is intentional, prefix it with an underscore: `_config`

warning: unused variable: `command`
   --> src/command/engine.rs:435:21
    |
435 |         if let Some(command) = self.active_commands.remove(correlation_id) {
    |                     ^^^^^^^ help: if this is intentional, prefix it with an underscore: `_command`

warning: unused variable: `disk_usage`
   --> src/telemetry/analytics.rs:176:21
    |
176 |                 let disk_usage = telemetry
    |                     ^^^^^^^^^^ help: if this is intentional, prefix it with an underscore: `_disk_usage`

warning: unused variable: `data_layer_for_server`
   --> src/main.rs:126:9
    |
126 |     let data_layer_for_server = data_layer.clone();
    |         ^^^^^^^^^^^^^^^^^^^^^ help: if this is intentional, prefix it with an underscore: `_data_layer_for_server`

warning: fields `sender` and `is_authenticated` are never read
  --> src/agent/connection.rs:23:9
   |
16 | pub struct AgentConnection<S>
   |            --------------- fields in this struct
...
23 |     pub sender: mpsc::UnboundedSender<WebSocketMessage>,
   |         ^^^^^^
...
26 |     pub is_authenticated: Arc<RwLock<bool>>,
   |         ^^^^^^^^^^^^^^^^
   |
   = note: `AgentConnection` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis
   = note: `#[warn(dead_code)]` on by default

warning: multiple methods are never used
   --> src/agent/connection.rs:140:14
    |
29  | / impl<S> AgentConnection<S>
30  | | where
31  | |     S: tokio::io::AsyncRead + tokio::io::AsyncWrite + Unpin + std::marker::Send,
    | |________________________________________________________________________________- methods in this implementation
...
140 |       async fn handle_text_message(&mut self, text: &str) -> BackendAgentResult<()> {
    |                ^^^^^^^^^^^^^^^^^^^
...
184 |       async fn handle_binary_message(&mut self, data: &[u8]) -> BackendAgentResult<()> {
    |                ^^^^^^^^^^^^^^^^^^^^^
...
202 |       async fn handle_hello_message(&mut self, hello_msg: HelloMessage) -> BackendAgentResult<()> {
    |                ^^^^^^^^^^^^^^^^^^^^
...
276 |       async fn handle_telemetry_message(
    |                ^^^^^^^^^^^^^^^^^^^^^^^^
...
304 |       async fn handle_result_message(&mut self, result_msg: ResultMessage) -> BackendAgentResult<()> {
    |                ^^^^^^^^^^^^^^^^^^^^^
...
329 |       async fn handle_heartbeat_message(
    |                ^^^^^^^^^^^^^^^^^^^^^^^^
...
351 |       pub async fn send_message(&self, message: WebSocketMessage) -> BackendAgentResult<()> {
    |                    ^^^^^^^^^^^^
...
368 |       pub async fn is_authenticated(&self) -> bool {
    |                    ^^^^^^^^^^^^^^^^
...
373 |       pub async fn get_last_heartbeat(&self) -> chrono::DateTime<chrono::Utc> {
    |                    ^^^^^^^^^^^^^^^^^^
...
385 |       pub async fn close(&mut self) -> BackendAgentResult<()> {
    |                    ^^^^^

warning: multiple methods are never used
   --> src/agent/manager.rs:81:18
    |
29  | impl AgentManager {
    | ----------------- methods in this implementation
...
81  |     pub async fn stop(&mut self) -> BackendAgentResult<()> {
    |                  ^^^^
...
184 |     pub async fn send_command_to_agent(
    |                  ^^^^^^^^^^^^^^^^^^^^^
...
241 |     pub async fn send_command_to_agents(
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
276 |     pub async fn send_command_to_all_agents(
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
287 |     pub async fn send_command_to_site(
    |                  ^^^^^^^^^^^^^^^^^^^^
...
299 |     pub async fn send_command_to_capability(
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
311 |     pub async fn get_agent(&self, agent_id: &str) -> Option<AgentInfo> {
    |                  ^^^^^^^^^
...
316 |     pub async fn list_agents(&self) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^
...
321 |     pub async fn get_agents_by_status(&self, status: &AgentStatus) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^
...
326 |     pub async fn get_agents_by_site(&self, site: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^
...
331 |     pub async fn get_agents_with_capability(&self, capability: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
336 |     pub async fn update_agent_status(
    |                  ^^^^^^^^^^^^^^^^^^^
...
345 |     pub async fn get_statistics(&self) -> crate::agent::registry::AgentStatistics {
    |                  ^^^^^^^^^^^^^^
...
350 |     pub async fn is_agent_online(&self, agent_id: &str) -> bool {
    |                  ^^^^^^^^^^^^^^^
...
355 |     pub async fn total_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^
...
360 |     pub async fn online_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^^
...
365 |     pub async fn offline_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^^^
...
370 |     pub async fn close_connection(&self, connection_id: &str) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^
...
385 |     async fn close_all_connections(&self) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^

warning: multiple methods are never used
   --> src/agent/registry.rs:26:18
    |
16  | impl AgentRegistry {
    | ------------------ methods in this implementation
...
26  |     pub async fn register_agent(
    |                  ^^^^^^^^^^^^^^
...
52  |     pub async fn unregister_agent(
    |                  ^^^^^^^^^^^^^^^^
...
81  |     pub async fn get_agent(&self, agent_id: &str) -> Option<AgentInfo> {
    |                  ^^^^^^^^^
...
86  |     pub async fn get_agent_by_connection(&self, connection_id: &str) -> Option<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^^
...
97  |     pub async fn list_agents(&self) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^
...
102 |     pub async fn get_agents_by_site(&self, site: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^
...
111 |     pub async fn get_agents_by_status(&self, status: &AgentStatus) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^
...
137 |     pub async fn update_agent_last_seen(&self, agent_id: &str) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
150 |     pub async fn is_agent_online(&self, agent_id: &str) -> bool {
    |                  ^^^^^^^^^^^^^^^
...
159 |     pub async fn get_connection_id(&self, agent_id: &str) -> Option<String> {
    |                  ^^^^^^^^^^^^^^^^^
...
166 |     pub async fn total_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^
...
171 |     pub async fn online_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^^
...
179 |     pub async fn offline_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^^^
...
187 |     pub async fn get_agents_with_capability(&self, capability: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
196 |     pub async fn get_agents_by_os(&self, os: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^
...
205 |     pub async fn get_agents_by_container_engine(&self, engine: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
240 |     pub async fn get_statistics(&self) -> AgentStatistics {
    |                  ^^^^^^^^^^^^^^
...
263 |     async fn get_os_distribution(&self) -> std::collections::HashMap<String, usize> {
    |              ^^^^^^^^^^^^^^^^^^^
...
273 |     async fn get_site_distribution(&self) -> std::collections::HashMap<String, usize> {
    |              ^^^^^^^^^^^^^^^^^^^^^
...
283 |     async fn get_capability_distribution(&self) -> std::collections::HashMap<String, usize> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^

warning: struct `AgentStatistics` is never constructed
   --> src/agent/registry.rs:297:12
    |
297 | pub struct AgentStatistics {
    |            ^^^^^^^^^^^^^^^

warning: associated function `new` is never used
  --> src/api/auth.rs:20:12
   |
19 | impl Claims {
   | ----------- associated function in this implementation
20 |     pub fn new(user_id: String, role: String, expires_in: Duration) -> Self {
   |            ^^^

warning: struct `AuthService` is never constructed
  --> src/api/auth.rs:35:12
   |
35 | pub struct AuthService {
   |            ^^^^^^^^^^^

warning: associated items `new`, `generate_token`, `validate_token`, and `check_role` are never used
  --> src/api/auth.rs:42:12
   |
41 | impl AuthService {
   | ---------------- associated items in this implementation
42 |     pub fn new(secret: &str) -> Self {
   |            ^^^
...
56 |     pub fn generate_token(&self, claims: Claims) -> BackendAgentResult<String> {
   |            ^^^^^^^^^^^^^^
...
65 |     pub fn validate_token(&self, token: &str) -> BackendAgentResult<Claims> {
   |            ^^^^^^^^^^^^^^
...
74 |     pub fn check_role(&self, claims: &Claims, required_role: &str) -> bool {
   |            ^^^^^^^^^^

warning: function `jwt_validator` is never used
  --> src/api/auth.rs:80:14
   |
80 | pub async fn jwt_validator(
   |              ^^^^^^^^^^^^^

warning: function `get_claims` is never used
   --> src/api/auth.rs:118:8
    |
118 | pub fn get_claims(req: &actix_web::HttpRequest) -> Option<Claims> {
    |        ^^^^^^^^^^

warning: function `require_admin_role` is never used
   --> src/api/auth.rs:123:8
    |
123 | pub fn require_admin_role(claims: &Claims) -> BackendAgentResult<()> {
    |        ^^^^^^^^^^^^^^^^^^

warning: function `require_operator_role` is never used
   --> src/api/auth.rs:133:8
    |
133 | pub fn require_operator_role(claims: &Claims) -> BackendAgentResult<()> {
    |        ^^^^^^^^^^^^^^^^^^^^^

warning: function `require_viewer_role` is never used
   --> src/api/auth.rs:143:8
    |
143 | pub fn require_viewer_role(claims: &Claims) -> BackendAgentResult<()> {
    |        ^^^^^^^^^^^^^^^^^^^

warning: fields `verb`, `args`, `agent_targets`, `timeout`, and `max_retries` are never read
  --> src/api/handlers.rs:17:9
   |
16 | pub struct CreateCommandRequest {
   |            -------------------- fields in this struct
17 |     pub verb: String,
   |         ^^^^
18 |     pub args: serde_json::Value,
   |         ^^^^
19 |     pub agent_targets: Vec<String>,
   |         ^^^^^^^^^^^^^
20 |     pub timeout: Option<u64>,
   |         ^^^^^^^
21 |     pub max_retries: Option<u32>,
   |         ^^^^^^^^^^^
   |
   = note: `CreateCommandRequest` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis

warning: struct `CreateCommandResponse` is never constructed
  --> src/api/handlers.rs:25:12
   |
25 | pub struct CreateCommandResponse {
   |            ^^^^^^^^^^^^^^^^^^^^^

warning: struct `AgentListResponse` is never constructed
  --> src/api/handlers.rs:31:12
   |
31 | pub struct AgentListResponse {
   |            ^^^^^^^^^^^^^^^^^

warning: struct `CommandListResponse` is never constructed
  --> src/api/handlers.rs:37:12
   |
37 | pub struct CommandListResponse {
   |            ^^^^^^^^^^^^^^^^^^^

warning: struct `StatisticsResponse` is never constructed
  --> src/api/handlers.rs:43:12
   |
43 | pub struct StatisticsResponse {
   |            ^^^^^^^^^^^^^^^^^^

warning: struct `HealthResponse` is never constructed
  --> src/api/handlers.rs:50:12
   |
50 | pub struct HealthResponse {
   |            ^^^^^^^^^^^^^^

warning: function `list_agents` is never used
  --> src/api/handlers.rs:58:14
   |
58 | pub async fn list_agents(
   |              ^^^^^^^^^^^

warning: function `get_agent` is never used
  --> src/api/handlers.rs:81:14
   |
81 | pub async fn get_agent(
   |              ^^^^^^^^^

warning: function `get_agents_by_site` is never used
   --> src/api/handlers.rs:104:14
    |
104 | pub async fn get_agents_by_site(
    |              ^^^^^^^^^^^^^^^^^^

warning: function `create_command` is never used
   --> src/api/handlers.rs:129:14
    |
129 | pub async fn create_command(
    |              ^^^^^^^^^^^^^^

warning: function `get_command` is never used
   --> src/api/handlers.rs:187:14
    |
187 | pub async fn get_command(
    |              ^^^^^^^^^^^

warning: function `list_commands` is never used
   --> src/api/handlers.rs:213:14
    |
213 | pub async fn list_commands(
    |              ^^^^^^^^^^^^^

warning: function `retry_command` is never used
   --> src/api/handlers.rs:253:14
    |
253 | pub async fn retry_command(
    |              ^^^^^^^^^^^^^

warning: function `cancel_command` is never used
   --> src/api/handlers.rs:284:14
    |
284 | pub async fn cancel_command(
    |              ^^^^^^^^^^^^^^

warning: function `get_agent_telemetry` is never used
   --> src/api/handlers.rs:316:14
    |
316 | pub async fn get_agent_telemetry(
    |              ^^^^^^^^^^^^^^^^^^^

warning: function `get_agent_telemetry_history` is never used
   --> src/api/handlers.rs:348:14
    |
348 | pub async fn get_agent_telemetry_history(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^

warning: function `get_statistics` is never used
   --> src/api/handlers.rs:385:14
    |
385 | pub async fn get_statistics(
    |              ^^^^^^^^^^^^^^

warning: function `health_check` is never used
   --> src/api/handlers.rs:413:14
    |
413 | pub async fn health_check() -> Result<HttpResponse> {
    |              ^^^^^^^^^^^^

warning: function `update_agent_status` is never used
   --> src/api/handlers.rs:425:14
    |
425 | pub async fn update_agent_status(
    |              ^^^^^^^^^^^^^^^^^^^

warning: fields `status`, `agent_id`, `verb`, and `limit` are never read
   --> src/api/handlers.rs:469:9
    |
468 | pub struct CommandListQuery {
    |            ---------------- fields in this struct
469 |     pub status: Option<String>,
    |         ^^^^^^
470 |     pub agent_id: Option<String>,
    |         ^^^^^^^^
471 |     pub verb: Option<String>,
    |         ^^^^
472 |     pub limit: Option<usize>,
    |         ^^^^^
    |
    = note: `CommandListQuery` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis

warning: fields `limit` and `hours` are never read
   --> src/api/handlers.rs:477:9
    |
476 | pub struct TelemetryHistoryQuery {
    |            --------------------- fields in this struct
477 |     pub limit: Option<usize>,
    |         ^^^^^
478 |     pub hours: Option<u32>,
    |         ^^^^^
    |
    = note: `TelemetryHistoryQuery` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis

warning: function `configure_routes` is never used
 --> src/api/routes.rs:6:8
  |
6 | pub fn configure_routes(cfg: &mut web::ServiceConfig) {
  |        ^^^^^^^^^^^^^^^^

warning: function `websocket_handler` is never used
  --> src/api/routes.rs:54:10
   |
54 | async fn websocket_handler() -> HttpResponse {
   |          ^^^^^^^^^^^^^^^^^

warning: fields `data_layer`, `agent_manager`, `executor`, `active_commands`, `command_semaphore`, and `is_running` are never read
  --> src/command/engine.rs:19:5
   |
17 | pub struct CommandEngine {
   |            ------------- fields in this struct
18 |     config: Config,
19 |     data_layer: DataLayer,
   |     ^^^^^^^^^^
20 |     agent_manager: Arc<AgentManager>,
   |     ^^^^^^^^^^^^^
21 |     queue: Arc<CommandQueue>,
22 |     executor: Arc<CommandExecutor>,
   |     ^^^^^^^^
23 |     active_commands: Arc<DashMap<String, QueuedCommand>>, // correlation_id -> command
   |     ^^^^^^^^^^^^^^^
24 |     command_semaphore: Arc<Semaphore>,
   |     ^^^^^^^^^^^^^^^^^
25 |     is_running: Arc<RwLock<bool>>,
   |     ^^^^^^^^^^

warning: multiple methods are never used
   --> src/command/engine.rs:60:18
    |
28  | impl CommandEngine {
    | ------------------ methods in this implementation
...
60  |     pub async fn start(&self) -> BackendAgentResult<()> {
    |                  ^^^^^
...
73  |     pub async fn stop(&self) -> BackendAgentResult<()> {
    |                  ^^^^
...
89  |     pub async fn submit_command(&self, command: CommandRecord) -> BackendAgentResult<String> {
    |                  ^^^^^^^^^^^^^^
...
108 |     pub async fn execute_command(
    |                  ^^^^^^^^^^^^^^^
...
180 |     pub async fn process_command_result(
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
209 |     pub async fn process_command_failure(
    |                  ^^^^^^^^^^^^^^^^^^^^^^^
...
238 |     pub async fn get_command(&self, correlation_id: &str) -> Option<QueuedCommand> {
    |                  ^^^^^^^^^^^
...
243 |     pub async fn get_pending_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^
...
248 |     pub async fn get_executing_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
253 |     pub async fn get_completed_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
258 |     pub async fn get_failed_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^
...
263 |     pub async fn get_commands_by_status(&self, status: &CommandStatus) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
268 |     pub async fn get_commands_for_agent(&self, agent_id: &str) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
273 |     pub async fn get_commands_by_verb(&self, verb: &str) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^
...
278 |     pub async fn retry_command(&self, correlation_id: &str) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^
...
295 |     pub async fn get_statistics(&self) -> CommandEngineStats {
    |                  ^^^^^^^^^^^^^^
...
308 |     pub async fn run_command_loop(&self) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^
...
375 |     async fn wait_for_active_commands(&self) {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^
...
431 |     pub async fn cancel_command(&self, correlation_id: &str) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^
...
454 |     pub async fn get_command_history(&self, limit: Option<usize>) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^

warning: struct `CommandEngineStats` is never constructed
   --> src/command/engine.rs:480:12
    |
480 | pub struct CommandEngineStats {
    |            ^^^^^^^^^^^^^^^^^^

warning: fields `max_concurrent_commands` and `command_timeout` are never read
  --> src/command/executor.rs:9:5
   |
8  | pub struct CommandExecutor {
   |            --------------- fields in this struct
9  |     max_concurrent_commands: usize,
   |     ^^^^^^^^^^^^^^^^^^^^^^^
10 |     command_timeout: u64,
   |     ^^^^^^^^^^^^^^^
   |
   = note: `CommandExecutor` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis

warning: multiple methods are never used
   --> src/command/executor.rs:22:18
    |
13  | impl CommandExecutor {
    | -------------------- methods in this implementation
...
22  |     pub async fn validate_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^
...
56  |     async fn validate_command_schema(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^
...
82  |     async fn validate_exec_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^
...
101 |     async fn validate_docker_ps_command(&self, _command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
107 |     async fn validate_docker_inspect_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
130 |     async fn validate_docker_logs_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
161 |     async fn validate_docker_stats_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
180 |     async fn validate_docker_top_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
199 |     async fn validate_docker_exec_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
233 |     async fn validate_docker_run_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
261 |     async fn validate_docker_stop_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
283 |     async fn validate_docker_rm_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
302 |     async fn validate_docker_pull_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
324 |     async fn validate_docker_build_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
355 |     async fn validate_docker_compose_up_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
378 |     async fn validate_docker_compose_down_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
401 |     async fn validate_docker_compose_ps_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
424 |     async fn validate_docker_compose_logs_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
456 |     pub async fn execute_command(
    |                  ^^^^^^^^^^^^^^^
...
496 |     pub async fn get_execution_stats(&self) -> ExecutionStats {
    |                  ^^^^^^^^^^^^^^^^^^^

warning: struct `ExecutionStats` is never constructed
   --> src/command/executor.rs:505:12
    |
505 | pub struct ExecutionStats {
    |            ^^^^^^^^^^^^^^

warning: associated items `new`, `with_priority`, `increment_retry`, and `can_retry` are never used
  --> src/command/queue.rs:19:12
   |
18 | impl QueuedCommand {
   | ------------------ associated items in this implementation
19 |     pub fn new(command: CommandRecord) -> Self {
   |            ^^^
...
28 |     pub fn with_priority(mut self, priority: CommandPriority) -> Self {
   |            ^^^^^^^^^^^^^
...
33 |     pub fn increment_retry(&mut self) {
   |            ^^^^^^^^^^^^^^^
...
37 |     pub fn can_retry(&self) -> bool {
   |            ^^^^^^^^^

warning: fields `pending`, `executing`, `priority_queue`, and `max_queue_size` are never read
  --> src/command/queue.rs:61:5
   |
60 | pub struct CommandQueue {
   |            ------------ fields in this struct
61 |     pending: Arc<DashMap<String, QueuedCommand>>, // correlation_id -> command
   |     ^^^^^^^
62 |     executing: Arc<DashMap<String, QueuedCommand>>, // correlation_id -> command
   |     ^^^^^^^^^
...
65 |     priority_queue: Arc<RwLock<BinaryHeap<QueuedCommand>>>,
   |     ^^^^^^^^^^^^^^
66 |     max_queue_size: usize,
   |     ^^^^^^^^^^^^^^
   |
   = note: `CommandQueue` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis

warning: multiple methods are never used
   --> src/command/queue.rs:82:18
    |
69  | impl CommandQueue {
    | ----------------- methods in this implementation
...
82  |     pub async fn enqueue(&self, command: CommandRecord) -> BackendAgentResult<()> {
    |                  ^^^^^^^
...
112 |     pub async fn dequeue(&self) -> Option<QueuedCommand> {
    |                  ^^^^^^^
...
136 |     pub async fn mark_completed(
    |                  ^^^^^^^^^^^^^^
...
162 |     pub async fn mark_failed(
    |                  ^^^^^^^^^^^
...
188 |     pub async fn retry_command(&self, correlation_id: &str) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^
...
227 |     pub async fn get_command(&self, correlation_id: &str) -> Option<QueuedCommand> {
    |                  ^^^^^^^^^^^
...
245 |     pub async fn get_pending_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^
...
250 |     pub async fn get_executing_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
255 |     pub async fn get_completed_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
260 |     pub async fn get_failed_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^
...
265 |     pub async fn get_statistics(&self) -> QueueStatistics {
    |                  ^^^^^^^^^^^^^^
...
329 |     pub async fn get_commands_by_status(&self, status: &CommandStatus) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
340 |     pub async fn get_commands_by_priority(&self, priority: &CommandPriority) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^
...
359 |     pub async fn get_commands_for_agent(&self, agent_id: &str) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
390 |     pub async fn get_commands_by_verb(&self, verb: &str) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^

warning: struct `QueueStatistics` is never constructed
   --> src/command/queue.rs:422:12
    |
422 | pub struct QueueStatistics {
    |            ^^^^^^^^^^^^^^^

warning: method `health_check` is never used
  --> src/data/mod.rs:27:18
   |
19 | impl DataLayer {
   | -------------- method in this implementation
...
27 |     pub async fn health_check(&self) -> BackendAgentResult<()> {
   |                  ^^^^^^^^^^^^

warning: field `config` is never read
  --> src/data/postgres.rs:11:9
   |
9  | pub struct PostgresClient {
   |            -------------- field in this struct
10 |     pub pool: sqlx::PgPool,
11 |     pub config: DatabaseConfig,
   |         ^^^^^^
   |
   = note: `PostgresClient` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis

warning: multiple methods are never used
   --> src/data/postgres.rs:50:18
    |
14  | impl PostgresClient {
    | ------------------- methods in this implementation
...
50  |     pub async fn health_check(&self) -> Result<(), BackendAgentError> {
    |                  ^^^^^^^^^^^^
...
69  |     pub fn get_pool(&self) -> &PgPool {
    |            ^^^^^^^^
...
238 |     pub async fn upsert_agent(&self, agent: &AgentInfo) -> Result<(), BackendAgentError> {
    |                  ^^^^^^^^^^^^
...
280 |     pub async fn get_agent(&self, agent_id: &str) -> Result<Option<AgentInfo>, BackendAgentError> {
    |                  ^^^^^^^^^
...
319 |     pub async fn list_agents(&self) -> Result<Vec<AgentInfo>, BackendAgentError> {
    |                  ^^^^^^^^^^^
...
354 |     pub async fn update_agent_status(
    |                  ^^^^^^^^^^^^^^^^^^^
...
378 |     pub async fn create_command(&self, command: &CommandRecord) -> Result<(), BackendAgentError> {
    |                  ^^^^^^^^^^^^^^
...
409 |     pub async fn get_command(
    |                  ^^^^^^^^^^^
...
458 |     pub async fn update_command_status(
    |                  ^^^^^^^^^^^^^^^^^^^^^
...
482 |     pub async fn store_telemetry(
    |                  ^^^^^^^^^^^^^^^
...
522 |     pub async fn get_latest_telemetry(
    |                  ^^^^^^^^^^^^^^^^^^^^
...
574 |     pub async fn log_audit_event(&self, audit_log: &AuditLog) -> Result<(), BackendAgentError> {
    |                  ^^^^^^^^^^^^^^^

warning: fields `client`, `manager`, and `config` are never read
  --> src/data/redis.rs:8:9
   |
7  | pub struct RedisClient {
   |            ----------- fields in this struct
8  |     pub client: Client,
   |         ^^^^^^
9  |     pub manager: ConnectionManager,
   |         ^^^^^^^
10 |     pub config: RedisConfig,
   |         ^^^^^^

warning: multiple methods are never used
   --> src/data/redis.rs:48:18
    |
13  | impl RedisClient {
    | ---------------- methods in this implementation
...
48  |     pub async fn health_check(&self) -> Result<(), BackendAgentError> {
    |                  ^^^^^^^^^^^^
...
68  |     pub fn get_manager(&self) -> &ConnectionManager {
    |            ^^^^^^^^^^^
...
76  |     pub async fn set(
    |                  ^^^
...
110 |     pub async fn get(&self, key: &str) -> Result<Option<String>, BackendAgentError> {
    |                  ^^^
...
125 |     pub async fn del(&self, key: &str) -> Result<(), BackendAgentError> {
    |                  ^^^
...
140 |     pub async fn exists(&self, key: &str) -> Result<bool, BackendAgentError> {
    |                  ^^^^^^
...
159 |     pub async fn hset(&self, key: &str, field: &str, value: &str) -> Result<(), BackendAgentError> {
    |                  ^^^^
...
176 |     pub async fn hget(&self, key: &str, field: &str) -> Result<Option<String>, BackendAgentError> {
    |                  ^^^^
...
194 |     pub async fn hgetall(&self, key: &str) -> Result<Vec<(String, String)>, BackendAgentError> {
    |                  ^^^^^^^
...
213 |     pub async fn lpush(&self, key: &str, value: &str) -> Result<(), BackendAgentError> {
    |                  ^^^^^
...
229 |     pub async fn rpop(&self, key: &str) -> Result<Option<String>, BackendAgentError> {
    |                  ^^^^
...
248 |     pub async fn sadd(&self, key: &str, member: &str) -> Result<(), BackendAgentError> {
    |                  ^^^^
...
264 |     pub async fn smembers(&self, key: &str) -> Result<Vec<String>, BackendAgentError> {
    |                  ^^^^^^^^
...
283 |     pub async fn expire(&self, key: &str, seconds: u64) -> Result<bool, BackendAgentError> {
    |                  ^^^^^^
...
299 |     pub async fn ttl(&self, key: &str) -> Result<i64, BackendAgentError> {
    |                  ^^^

warning: variants `Authentication`, `Authorization`, `CommandExecution`, `Connection`, and `RateLimit` are never constructed
  --> src/error.rs:21:5
   |
7  | pub enum BackendAgentError {
   |          ----------------- variants in this enum
...
21 |     Authentication(String),
   |     ^^^^^^^^^^^^^^
...
24 |     Authorization(String),
   |     ^^^^^^^^^^^^^
...
27 |     CommandExecution(String),
   |     ^^^^^^^^^^^^^^^^
...
36 |     Connection(String),
   |     ^^^^^^^^^^
...
45 |     RateLimit(String),
   |     ^^^^^^^^^
   |
   = note: `BackendAgentError` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis

warning: field `data_layer` is never read
 --> src/telemetry/analytics.rs:9:5
  |
8 | pub struct TelemetryAnalytics {
  |            ------------------ field in this struct
9 |     data_layer: DataLayer,
  |     ^^^^^^^^^^

warning: multiple methods are never used
   --> src/telemetry/analytics.rs:18:18
    |
12  | impl TelemetryAnalytics {
    | ----------------------- methods in this implementation
...
18  |     pub async fn process_telemetry(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^^
...
38  |     async fn check_cpu_alerts(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^
...
62  |     async fn check_memory_alerts(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^
...
87  |     async fn check_disk_alerts(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^
...
116 |     async fn check_container_alerts(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^
...
142 |     pub async fn get_statistics(&self) -> AnalyticsStats {
    |                  ^^^^^^^^^^^^^^
...
153 |     pub async fn generate_health_report(
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
236 |     pub async fn get_resource_trends(
    |                  ^^^^^^^^^^^^^^^^^^^

warning: struct `AnalyticsStats` is never constructed
   --> src/telemetry/analytics.rs:262:12
    |
262 | pub struct AnalyticsStats {
    |            ^^^^^^^^^^^^^^

warning: struct `HealthReport` is never constructed
   --> src/telemetry/analytics.rs:270:12
    |
270 | pub struct HealthReport {
    |            ^^^^^^^^^^^^

warning: struct `AgentHealthSummary` is never constructed
   --> src/telemetry/analytics.rs:282:12
    |
282 | pub struct AgentHealthSummary {
    |            ^^^^^^^^^^^^^^^^^^

warning: struct `ResourceTrends` is never constructed
   --> src/telemetry/analytics.rs:292:12
    |
292 | pub struct ResourceTrends {
    |            ^^^^^^^^^^^^^^

warning: fields `config`, `data_layer`, `telemetry_queue`, `telemetry_receiver`, and `is_running` are never read
  --> src/telemetry/processor.rs:13:5
   |
12 | pub struct TelemetryProcessor {
   |            ------------------ fields in this struct
13 |     config: Config,
   |     ^^^^^^
14 |     data_layer: DataLayer,
   |     ^^^^^^^^^^
...
17 |     telemetry_queue: Arc<mpsc::UnboundedSender<TelemetryMessage>>,
   |     ^^^^^^^^^^^^^^^
18 |     telemetry_receiver: Arc<RwLock<Option<mpsc::UnboundedReceiver<TelemetryMessage>>>>,
   |     ^^^^^^^^^^^^^^^^^^
19 |     is_running: Arc<RwLock<bool>>,
   |     ^^^^^^^^^^

warning: multiple methods are never used
   --> src/telemetry/processor.rs:49:18
    |
22  | impl TelemetryProcessor {
    | ----------------------- methods in this implementation
...
49  |     pub async fn start(&self) -> BackendAgentResult<()> {
    |                  ^^^^^
...
62  |     pub async fn stop(&self) -> BackendAgentResult<()> {
    |                  ^^^^
...
75  |     pub async fn process_telemetry(
    |                  ^^^^^^^^^^^^^^^^^
...
130 |     pub async fn queue_telemetry(&self, telemetry_msg: TelemetryMessage) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^
...
141 |     pub async fn run_processing_loop(&self) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^^^^
...
172 |     pub async fn get_statistics(&self) -> TelemetryStats {
    |                  ^^^^^^^^^^^^^^
...
183 |     pub async fn get_latest_telemetry(
    |                  ^^^^^^^^^^^^^^^^^^^^
...
191 |     pub async fn get_telemetry_history(
    |                  ^^^^^^^^^^^^^^^^^^^^^

warning: struct `TelemetryStats` is never constructed
   --> src/telemetry/processor.rs:253:12
    |
253 | pub struct TelemetryStats {
    |            ^^^^^^^^^^^^^^

warning: field `data_layer` is never read
 --> src/telemetry/storage.rs:8:5
  |
7 | pub struct TelemetryStorage {
  |            ---------------- field in this struct
8 |     data_layer: DataLayer,
  |     ^^^^^^^^^^

warning: multiple methods are never used
   --> src/telemetry/storage.rs:17:18
    |
11  | impl TelemetryStorage {
    | --------------------- methods in this implementation
...
17  |     pub async fn store_telemetry(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^
...
44  |     pub async fn get_latest_telemetry(
    |                  ^^^^^^^^^^^^^^^^^^^^
...
90  |     pub async fn get_telemetry_history(
    |                  ^^^^^^^^^^^^^^^^^^^^^
...
133 |     pub async fn get_telemetry_for_agents(
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^
...
170 |     pub async fn get_statistics(&self) -> StorageStats {
    |                  ^^^^^^^^^^^^^^
...
182 |     pub async fn batch_store_telemetry(
    |                  ^^^^^^^^^^^^^^^^^^^^^
...
206 |     pub async fn get_telemetry_summary(
    |                  ^^^^^^^^^^^^^^^^^^^^^

warning: struct `StorageStats` is never constructed
   --> src/telemetry/storage.rs:250:12
    |
250 | pub struct StorageStats {
    |            ^^^^^^^^^^^^

warning: struct `TelemetrySummary` is never constructed
   --> src/telemetry/storage.rs:259:12
    |
259 | pub struct TelemetrySummary {
    |            ^^^^^^^^^^^^^^^^

warning: `viworks-backend-agent` (bin "viworks-backend-agent" test) generated 105 warnings (run `cargo fix --bin "viworks-backend-agent" --tests` to apply 31 suggestions)
    Finished `test` profile [unoptimized + debuginfo] target(s) in 20.82s
warning: the following packages contain code that will be rejected by a future version of Rust: redis v0.24.0, sqlx-postgres v0.7.4
note: to see what the problems were, use the option `--future-incompat-report`, or run `cargo report future-incompatibilities --id 1`
     Running `/home/runner/work/viworkdemo002/viworkdemo002/backend agent/target/debug/deps/viworks_backend_agent-76c07ce4fbd6ccad`

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

    Checking viworks-backend-agent v0.1.0 (/home/runner/work/viworkdemo002/viworkdemo002/backend agent)
warning: unused import: `actix_cors::Cors`
 --> src/main.rs:1:5
  |
1 | use actix_cors::Cors;
  |     ^^^^^^^^^^^^^^^^
  |
  = note: `#[warn(unused_imports)]` on by default

warning: unused import: `crate::command::CommandEngine`
 --> src/agent/manager.rs:3:5
  |
3 | use crate::command::CommandEngine;
  |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `crate::telemetry::TelemetryProcessor`
 --> src/agent/manager.rs:8:5
  |
8 | use crate::telemetry::TelemetryProcessor;
  |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused imports: `App`, `HttpServer`, `middleware::Logger`, and `web`
 --> src/agent/manager.rs:9:17
  |
9 | use actix_web::{middleware::Logger, web, App, HttpServer};
  |                 ^^^^^^^^^^^^^^^^^^  ^^^  ^^^  ^^^^^^^^^^

warning: unused import: `std::net::SocketAddr`
  --> src/agent/manager.rs:11:5
   |
11 | use std::net::SocketAddr;
   |     ^^^^^^^^^^^^^^^^^^^^

warning: unused import: `tokio_tungstenite::tungstenite::handshake::server::Callback`
  --> src/agent/manager.rs:16:5
   |
16 | use tokio_tungstenite::tungstenite::handshake::server::Callback;
   |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `WebSocketStream`
  --> src/agent/manager.rs:17:39
   |
17 | use tokio_tungstenite::{accept_async, WebSocketStream};
   |                                       ^^^^^^^^^^^^^^^

warning: unused import: `tokio::sync::RwLock`
 --> src/agent/registry.rs:5:5
  |
5 | use tokio::sync::RwLock;
  |     ^^^^^^^^^^^^^^^^^^^

warning: unused import: `error`
 --> src/agent/registry.rs:6:22
  |
6 | use tracing::{debug, error, info, warn};
  |                      ^^^^^

warning: unused import: `uuid::Uuid`
 --> src/agent/registry.rs:7:5
  |
7 | use uuid::Uuid;
  |     ^^^^^^^^^^

warning: unused import: `info`
 --> src/api/auth.rs:9:29
  |
9 | use tracing::{debug, error, info, warn};
  |                             ^^^^

warning: unused import: `warn`
  --> src/api/handlers.rs:11:35
   |
11 | use tracing::{debug, error, info, warn};
   |                                   ^^^^

warning: unused import: `auth::*`
 --> src/api/mod.rs:5:9
  |
5 | pub use auth::*;
  |         ^^^^^^^

warning: unused import: `handlers::*`
 --> src/api/mod.rs:6:9
  |
6 | pub use handlers::*;
  |         ^^^^^^^^^^^

warning: unused import: `routes::configure_routes`
 --> src/api/mod.rs:7:9
  |
7 | pub use routes::configure_routes;
  |         ^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused imports: `CommandPriority` and `CommandStatus`
 --> src/command/executor.rs:1:27
  |
1 | use crate::data::models::{CommandPriority, CommandRecord, CommandResult, CommandStatus};
  |                           ^^^^^^^^^^^^^^^                                ^^^^^^^^^^^^^

warning: unused import: `serde_json::Value`
 --> src/command/executor.rs:3:5
  |
3 | use serde_json::Value;
  |     ^^^^^^^^^^^^^^^^^

warning: unused import: `std::collections::HashMap`
 --> src/command/executor.rs:4:5
  |
4 | use std::collections::HashMap;
  |     ^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused imports: `debug` and `error`
 --> src/command/executor.rs:5:15
  |
5 | use tracing::{debug, error, info, warn};
  |               ^^^^^  ^^^^^

warning: unused import: `error`
 --> src/command/queue.rs:7:22
  |
7 | use tracing::{debug, error, info, warn};
  |                      ^^^^^

warning: unused import: `uuid::Uuid`
 --> src/command/queue.rs:8:5
  |
8 | use uuid::Uuid;
  |     ^^^^^^^^^^

warning: unused import: `models::*`
 --> src/data/mod.rs:5:9
  |
5 | pub use models::*;
  |         ^^^^^^^^^

warning: unused import: `std::fmt`
 --> src/error.rs:3:5
  |
3 | use std::fmt;
  |     ^^^^^^^^

warning: unused import: `std::collections::HashMap`
 --> src/telemetry/analytics.rs:4:5
  |
4 | use std::collections::HashMap;
  |     ^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `std::sync::Arc`
 --> src/telemetry/analytics.rs:5:5
  |
5 | use std::sync::Arc;
  |     ^^^^^^^^^^^^^^

warning: unused import: `error`
 --> src/telemetry/analytics.rs:6:22
  |
6 | use tracing::{debug, error, info, warn};
  |                      ^^^^^

warning: unused import: `AgentInfo`
 --> src/telemetry/processor.rs:2:27
  |
2 | use crate::data::models::{AgentInfo, NetworkStats, TelemetryMessage, TelemetryRecord};
  |                           ^^^^^^^^^

warning: unused imports: `debug` and `warn`
 --> src/telemetry/processor.rs:9:15
  |
9 | use tracing::{debug, error, info, warn};
  |               ^^^^^               ^^^^

warning: unused import: `std::sync::Arc`
 --> src/telemetry/storage.rs:4:5
  |
4 | use std::sync::Arc;
  |     ^^^^^^^^^^^^^^

warning: unused variable: `registry`
   --> src/agent/manager.rs:145:9
    |
145 |         registry: Arc<AgentRegistry>,
    |         ^^^^^^^^ help: if this is intentional, prefix it with an underscore: `_registry`
    |
    = note: `#[warn(unused_variables)]` on by default

warning: unused variable: `config`
   --> src/agent/manager.rs:149:9
    |
149 |         config: Config,
    |         ^^^^^^ help: if this is intentional, prefix it with an underscore: `_config`

warning: variable does not need to be mutable
   --> src/agent/manager.rs:160:13
    |
160 |         let mut connection = AgentConnection::new(ws_stream);
    |             ----^^^^^^^^^^
    |             |
    |             help: remove this `mut`
    |
    = note: `#[warn(unused_mut)]` on by default

warning: unused variable: `agent_info`
   --> src/agent/manager.rs:190:13
    |
190 |         let agent_info =
    |             ^^^^^^^^^^ help: if this is intentional, prefix it with an underscore: `_agent_info`

warning: unused variable: `config`
   --> src/agent/manager.rs:436:17
    |
436 |             let config = config.clone();
    |                 ^^^^^^ help: if this is intentional, prefix it with an underscore: `_config`

warning: variable does not need to be mutable
   --> src/api/auth.rs:103:17
    |
103 |             let mut req = req;
    |                 ----^^^
    |                 |
    |                 help: remove this `mut`

warning: unused variable: `ws_message`
   --> src/command/engine.rs:136:13
    |
136 |         let ws_message = WebSocketMessage {
    |             ^^^^^^^^^^ help: if this is intentional, prefix it with an underscore: `_ws_message`

warning: unused variable: `config`
   --> src/command/engine.rs:404:13
    |
404 |         let config = self.config.clone();
    |             ^^^^^^ help: if this is intentional, prefix it with an underscore: `_config`

warning: unused variable: `command`
   --> src/command/engine.rs:435:21
    |
435 |         if let Some(command) = self.active_commands.remove(correlation_id) {
    |                     ^^^^^^^ help: if this is intentional, prefix it with an underscore: `_command`

warning: unused variable: `disk_usage`
   --> src/telemetry/analytics.rs:176:21
    |
176 |                 let disk_usage = telemetry
    |                     ^^^^^^^^^^ help: if this is intentional, prefix it with an underscore: `_disk_usage`

warning: unused variable: `data_layer_for_server`
   --> src/main.rs:126:9
    |
126 |     let data_layer_for_server = data_layer.clone();
    |         ^^^^^^^^^^^^^^^^^^^^^ help: if this is intentional, prefix it with an underscore: `_data_layer_for_server`

warning: fields `sender` and `is_authenticated` are never read
  --> src/agent/connection.rs:23:9
   |
16 | pub struct AgentConnection<S>
   |            --------------- fields in this struct
...
23 |     pub sender: mpsc::UnboundedSender<WebSocketMessage>,
   |         ^^^^^^
...
26 |     pub is_authenticated: Arc<RwLock<bool>>,
   |         ^^^^^^^^^^^^^^^^
   |
   = note: `AgentConnection` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis
   = note: `#[warn(dead_code)]` on by default

warning: multiple methods are never used
   --> src/agent/connection.rs:140:14
    |
29  | / impl<S> AgentConnection<S>
30  | | where
31  | |     S: tokio::io::AsyncRead + tokio::io::AsyncWrite + Unpin + std::marker::Send,
    | |________________________________________________________________________________- methods in this implementation
...
140 |       async fn handle_text_message(&mut self, text: &str) -> BackendAgentResult<()> {
    |                ^^^^^^^^^^^^^^^^^^^
...
184 |       async fn handle_binary_message(&mut self, data: &[u8]) -> BackendAgentResult<()> {
    |                ^^^^^^^^^^^^^^^^^^^^^
...
202 |       async fn handle_hello_message(&mut self, hello_msg: HelloMessage) -> BackendAgentResult<()> {
    |                ^^^^^^^^^^^^^^^^^^^^
...
276 |       async fn handle_telemetry_message(
    |                ^^^^^^^^^^^^^^^^^^^^^^^^
...
304 |       async fn handle_result_message(&mut self, result_msg: ResultMessage) -> BackendAgentResult<()> {
    |                ^^^^^^^^^^^^^^^^^^^^^
...
329 |       async fn handle_heartbeat_message(
    |                ^^^^^^^^^^^^^^^^^^^^^^^^
...
351 |       pub async fn send_message(&self, message: WebSocketMessage) -> BackendAgentResult<()> {
    |                    ^^^^^^^^^^^^
...
368 |       pub async fn is_authenticated(&self) -> bool {
    |                    ^^^^^^^^^^^^^^^^
...
373 |       pub async fn get_last_heartbeat(&self) -> chrono::DateTime<chrono::Utc> {
    |                    ^^^^^^^^^^^^^^^^^^
...
385 |       pub async fn close(&mut self) -> BackendAgentResult<()> {
    |                    ^^^^^

warning: multiple methods are never used
   --> src/agent/manager.rs:81:18
    |
29  | impl AgentManager {
    | ----------------- methods in this implementation
...
81  |     pub async fn stop(&mut self) -> BackendAgentResult<()> {
    |                  ^^^^
...
184 |     pub async fn send_command_to_agent(
    |                  ^^^^^^^^^^^^^^^^^^^^^
...
241 |     pub async fn send_command_to_agents(
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
276 |     pub async fn send_command_to_all_agents(
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
287 |     pub async fn send_command_to_site(
    |                  ^^^^^^^^^^^^^^^^^^^^
...
299 |     pub async fn send_command_to_capability(
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
311 |     pub async fn get_agent(&self, agent_id: &str) -> Option<AgentInfo> {
    |                  ^^^^^^^^^
...
316 |     pub async fn list_agents(&self) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^
...
321 |     pub async fn get_agents_by_status(&self, status: &AgentStatus) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^
...
326 |     pub async fn get_agents_by_site(&self, site: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^
...
331 |     pub async fn get_agents_with_capability(&self, capability: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
336 |     pub async fn update_agent_status(
    |                  ^^^^^^^^^^^^^^^^^^^
...
345 |     pub async fn get_statistics(&self) -> crate::agent::registry::AgentStatistics {
    |                  ^^^^^^^^^^^^^^
...
350 |     pub async fn is_agent_online(&self, agent_id: &str) -> bool {
    |                  ^^^^^^^^^^^^^^^
...
355 |     pub async fn total_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^
...
360 |     pub async fn online_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^^
...
365 |     pub async fn offline_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^^^
...
370 |     pub async fn close_connection(&self, connection_id: &str) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^
...
385 |     async fn close_all_connections(&self) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^

warning: multiple methods are never used
   --> src/agent/registry.rs:26:18
    |
16  | impl AgentRegistry {
    | ------------------ methods in this implementation
...
26  |     pub async fn register_agent(
    |                  ^^^^^^^^^^^^^^
...
52  |     pub async fn unregister_agent(
    |                  ^^^^^^^^^^^^^^^^
...
81  |     pub async fn get_agent(&self, agent_id: &str) -> Option<AgentInfo> {
    |                  ^^^^^^^^^
...
86  |     pub async fn get_agent_by_connection(&self, connection_id: &str) -> Option<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^^
...
97  |     pub async fn list_agents(&self) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^
...
102 |     pub async fn get_agents_by_site(&self, site: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^
...
111 |     pub async fn get_agents_by_status(&self, status: &AgentStatus) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^
...
137 |     pub async fn update_agent_last_seen(&self, agent_id: &str) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
150 |     pub async fn is_agent_online(&self, agent_id: &str) -> bool {
    |                  ^^^^^^^^^^^^^^^
...
159 |     pub async fn get_connection_id(&self, agent_id: &str) -> Option<String> {
    |                  ^^^^^^^^^^^^^^^^^
...
166 |     pub async fn total_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^
...
171 |     pub async fn online_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^^
...
179 |     pub async fn offline_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^^^
...
187 |     pub async fn get_agents_with_capability(&self, capability: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
196 |     pub async fn get_agents_by_os(&self, os: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^
...
205 |     pub async fn get_agents_by_container_engine(&self, engine: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
240 |     pub async fn get_statistics(&self) -> AgentStatistics {
    |                  ^^^^^^^^^^^^^^
...
263 |     async fn get_os_distribution(&self) -> std::collections::HashMap<String, usize> {
    |              ^^^^^^^^^^^^^^^^^^^
...
273 |     async fn get_site_distribution(&self) -> std::collections::HashMap<String, usize> {
    |              ^^^^^^^^^^^^^^^^^^^^^
...
283 |     async fn get_capability_distribution(&self) -> std::collections::HashMap<String, usize> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^

warning: struct `AgentStatistics` is never constructed
   --> src/agent/registry.rs:297:12
    |
297 | pub struct AgentStatistics {
    |            ^^^^^^^^^^^^^^^

warning: associated function `new` is never used
  --> src/api/auth.rs:20:12
   |
19 | impl Claims {
   | ----------- associated function in this implementation
20 |     pub fn new(user_id: String, role: String, expires_in: Duration) -> Self {
   |            ^^^

warning: struct `AuthService` is never constructed
  --> src/api/auth.rs:35:12
   |
35 | pub struct AuthService {
   |            ^^^^^^^^^^^

warning: associated items `new`, `generate_token`, `validate_token`, and `check_role` are never used
  --> src/api/auth.rs:42:12
   |
41 | impl AuthService {
   | ---------------- associated items in this implementation
42 |     pub fn new(secret: &str) -> Self {
   |            ^^^
...
56 |     pub fn generate_token(&self, claims: Claims) -> BackendAgentResult<String> {
   |            ^^^^^^^^^^^^^^
...
65 |     pub fn validate_token(&self, token: &str) -> BackendAgentResult<Claims> {
   |            ^^^^^^^^^^^^^^
...
74 |     pub fn check_role(&self, claims: &Claims, required_role: &str) -> bool {
   |            ^^^^^^^^^^

warning: function `jwt_validator` is never used
  --> src/api/auth.rs:80:14
   |
80 | pub async fn jwt_validator(
   |              ^^^^^^^^^^^^^

warning: function `get_claims` is never used
   --> src/api/auth.rs:118:8
    |
118 | pub fn get_claims(req: &actix_web::HttpRequest) -> Option<Claims> {
    |        ^^^^^^^^^^

warning: function `require_admin_role` is never used
   --> src/api/auth.rs:123:8
    |
123 | pub fn require_admin_role(claims: &Claims) -> BackendAgentResult<()> {
    |        ^^^^^^^^^^^^^^^^^^

warning: function `require_operator_role` is never used
   --> src/api/auth.rs:133:8
    |
133 | pub fn require_operator_role(claims: &Claims) -> BackendAgentResult<()> {
    |        ^^^^^^^^^^^^^^^^^^^^^

warning: function `require_viewer_role` is never used
   --> src/api/auth.rs:143:8
    |
143 | pub fn require_viewer_role(claims: &Claims) -> BackendAgentResult<()> {
    |        ^^^^^^^^^^^^^^^^^^^

warning: fields `verb`, `args`, `agent_targets`, `timeout`, and `max_retries` are never read
  --> src/api/handlers.rs:17:9
   |
16 | pub struct CreateCommandRequest {
   |            -------------------- fields in this struct
17 |     pub verb: String,
   |         ^^^^
18 |     pub args: serde_json::Value,
   |         ^^^^
19 |     pub agent_targets: Vec<String>,
   |         ^^^^^^^^^^^^^
20 |     pub timeout: Option<u64>,
   |         ^^^^^^^
21 |     pub max_retries: Option<u32>,
   |         ^^^^^^^^^^^
   |
   = note: `CreateCommandRequest` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis

warning: struct `CreateCommandResponse` is never constructed
  --> src/api/handlers.rs:25:12
   |
25 | pub struct CreateCommandResponse {
   |            ^^^^^^^^^^^^^^^^^^^^^

warning: struct `AgentListResponse` is never constructed
  --> src/api/handlers.rs:31:12
   |
31 | pub struct AgentListResponse {
   |            ^^^^^^^^^^^^^^^^^

warning: struct `CommandListResponse` is never constructed
  --> src/api/handlers.rs:37:12
   |
37 | pub struct CommandListResponse {
   |            ^^^^^^^^^^^^^^^^^^^

warning: struct `StatisticsResponse` is never constructed
  --> src/api/handlers.rs:43:12
   |
43 | pub struct StatisticsResponse {
   |            ^^^^^^^^^^^^^^^^^^

warning: struct `HealthResponse` is never constructed
  --> src/api/handlers.rs:50:12
   |
50 | pub struct HealthResponse {
   |            ^^^^^^^^^^^^^^

warning: function `list_agents` is never used
  --> src/api/handlers.rs:58:14
   |
58 | pub async fn list_agents(
   |              ^^^^^^^^^^^

warning: function `get_agent` is never used
  --> src/api/handlers.rs:81:14
   |
81 | pub async fn get_agent(
   |              ^^^^^^^^^

warning: function `get_agents_by_site` is never used
   --> src/api/handlers.rs:104:14
    |
104 | pub async fn get_agents_by_site(
    |              ^^^^^^^^^^^^^^^^^^

warning: function `create_command` is never used
   --> src/api/handlers.rs:129:14
    |
129 | pub async fn create_command(
    |              ^^^^^^^^^^^^^^

warning: function `get_command` is never used
   --> src/api/handlers.rs:187:14
    |
187 | pub async fn get_command(
    |              ^^^^^^^^^^^

warning: function `list_commands` is never used
   --> src/api/handlers.rs:213:14
    |
213 | pub async fn list_commands(
    |              ^^^^^^^^^^^^^

warning: function `retry_command` is never used
   --> src/api/handlers.rs:253:14
    |
253 | pub async fn retry_command(
    |              ^^^^^^^^^^^^^

warning: function `cancel_command` is never used
   --> src/api/handlers.rs:284:14
    |
284 | pub async fn cancel_command(
    |              ^^^^^^^^^^^^^^

warning: function `get_agent_telemetry` is never used
   --> src/api/handlers.rs:316:14
    |
316 | pub async fn get_agent_telemetry(
    |              ^^^^^^^^^^^^^^^^^^^

warning: function `get_agent_telemetry_history` is never used
   --> src/api/handlers.rs:348:14
    |
348 | pub async fn get_agent_telemetry_history(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^

warning: function `get_statistics` is never used
   --> src/api/handlers.rs:385:14
    |
385 | pub async fn get_statistics(
    |              ^^^^^^^^^^^^^^

warning: function `health_check` is never used
   --> src/api/handlers.rs:413:14
    |
413 | pub async fn health_check() -> Result<HttpResponse> {
    |              ^^^^^^^^^^^^

warning: function `update_agent_status` is never used
   --> src/api/handlers.rs:425:14
    |
425 | pub async fn update_agent_status(
    |              ^^^^^^^^^^^^^^^^^^^

warning: fields `status`, `agent_id`, `verb`, and `limit` are never read
   --> src/api/handlers.rs:469:9
    |
468 | pub struct CommandListQuery {
    |            ---------------- fields in this struct
469 |     pub status: Option<String>,
    |         ^^^^^^
470 |     pub agent_id: Option<String>,
    |         ^^^^^^^^
471 |     pub verb: Option<String>,
    |         ^^^^
472 |     pub limit: Option<usize>,
    |         ^^^^^
    |
    = note: `CommandListQuery` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis

warning: fields `limit` and `hours` are never read
   --> src/api/handlers.rs:477:9
    |
476 | pub struct TelemetryHistoryQuery {
    |            --------------------- fields in this struct
477 |     pub limit: Option<usize>,
    |         ^^^^^
478 |     pub hours: Option<u32>,
    |         ^^^^^
    |
    = note: `TelemetryHistoryQuery` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis

warning: function `configure_routes` is never used
 --> src/api/routes.rs:6:8
  |
6 | pub fn configure_routes(cfg: &mut web::ServiceConfig) {
  |        ^^^^^^^^^^^^^^^^

warning: function `websocket_handler` is never used
  --> src/api/routes.rs:54:10
   |
54 | async fn websocket_handler() -> HttpResponse {
   |          ^^^^^^^^^^^^^^^^^

warning: fields `data_layer`, `agent_manager`, `executor`, `active_commands`, `command_semaphore`, and `is_running` are never read
  --> src/command/engine.rs:19:5
   |
17 | pub struct CommandEngine {
   |            ------------- fields in this struct
18 |     config: Config,
19 |     data_layer: DataLayer,
   |     ^^^^^^^^^^
20 |     agent_manager: Arc<AgentManager>,
   |     ^^^^^^^^^^^^^
21 |     queue: Arc<CommandQueue>,
22 |     executor: Arc<CommandExecutor>,
   |     ^^^^^^^^
23 |     active_commands: Arc<DashMap<String, QueuedCommand>>, // correlation_id -> command
   |     ^^^^^^^^^^^^^^^
24 |     command_semaphore: Arc<Semaphore>,
   |     ^^^^^^^^^^^^^^^^^
25 |     is_running: Arc<RwLock<bool>>,
   |     ^^^^^^^^^^

warning: multiple methods are never used
   --> src/command/engine.rs:60:18
    |
28  | impl CommandEngine {
    | ------------------ methods in this implementation
...
60  |     pub async fn start(&self) -> BackendAgentResult<()> {
    |                  ^^^^^
...
73  |     pub async fn stop(&self) -> BackendAgentResult<()> {
    |                  ^^^^
...
89  |     pub async fn submit_command(&self, command: CommandRecord) -> BackendAgentResult<String> {
    |                  ^^^^^^^^^^^^^^
...
108 |     pub async fn execute_command(
    |                  ^^^^^^^^^^^^^^^
...
180 |     pub async fn process_command_result(
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
209 |     pub async fn process_command_failure(
    |                  ^^^^^^^^^^^^^^^^^^^^^^^
...
238 |     pub async fn get_command(&self, correlation_id: &str) -> Option<QueuedCommand> {
    |                  ^^^^^^^^^^^
...
243 |     pub async fn get_pending_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^
...
248 |     pub async fn get_executing_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
253 |     pub async fn get_completed_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
258 |     pub async fn get_failed_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^
...
263 |     pub async fn get_commands_by_status(&self, status: &CommandStatus) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
268 |     pub async fn get_commands_for_agent(&self, agent_id: &str) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
273 |     pub async fn get_commands_by_verb(&self, verb: &str) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^
...
278 |     pub async fn retry_command(&self, correlation_id: &str) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^
...
295 |     pub async fn get_statistics(&self) -> CommandEngineStats {
    |                  ^^^^^^^^^^^^^^
...
308 |     pub async fn run_command_loop(&self) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^
...
375 |     async fn wait_for_active_commands(&self) {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^
...
431 |     pub async fn cancel_command(&self, correlation_id: &str) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^
...
454 |     pub async fn get_command_history(&self, limit: Option<usize>) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^

warning: struct `CommandEngineStats` is never constructed
   --> src/command/engine.rs:480:12
    |
480 | pub struct CommandEngineStats {
    |            ^^^^^^^^^^^^^^^^^^

warning: fields `max_concurrent_commands` and `command_timeout` are never read
  --> src/command/executor.rs:9:5
   |
8  | pub struct CommandExecutor {
   |            --------------- fields in this struct
9  |     max_concurrent_commands: usize,
   |     ^^^^^^^^^^^^^^^^^^^^^^^
10 |     command_timeout: u64,
   |     ^^^^^^^^^^^^^^^
   |
   = note: `CommandExecutor` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis

warning: multiple methods are never used
   --> src/command/executor.rs:22:18
    |
13  | impl CommandExecutor {
    | -------------------- methods in this implementation
...
22  |     pub async fn validate_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^
...
56  |     async fn validate_command_schema(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^
...
82  |     async fn validate_exec_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^
...
101 |     async fn validate_docker_ps_command(&self, _command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
107 |     async fn validate_docker_inspect_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
130 |     async fn validate_docker_logs_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
161 |     async fn validate_docker_stats_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
180 |     async fn validate_docker_top_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
199 |     async fn validate_docker_exec_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
233 |     async fn validate_docker_run_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
261 |     async fn validate_docker_stop_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
283 |     async fn validate_docker_rm_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
302 |     async fn validate_docker_pull_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
324 |     async fn validate_docker_build_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
355 |     async fn validate_docker_compose_up_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
378 |     async fn validate_docker_compose_down_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
401 |     async fn validate_docker_compose_ps_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
424 |     async fn validate_docker_compose_logs_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
456 |     pub async fn execute_command(
    |                  ^^^^^^^^^^^^^^^
...
496 |     pub async fn get_execution_stats(&self) -> ExecutionStats {
    |                  ^^^^^^^^^^^^^^^^^^^

warning: struct `ExecutionStats` is never constructed
   --> src/command/executor.rs:505:12
    |
505 | pub struct ExecutionStats {
    |            ^^^^^^^^^^^^^^

warning: associated items `new`, `with_priority`, `increment_retry`, and `can_retry` are never used
  --> src/command/queue.rs:19:12
   |
18 | impl QueuedCommand {
   | ------------------ associated items in this implementation
19 |     pub fn new(command: CommandRecord) -> Self {
   |            ^^^
...
28 |     pub fn with_priority(mut self, priority: CommandPriority) -> Self {
   |            ^^^^^^^^^^^^^
...
33 |     pub fn increment_retry(&mut self) {
   |            ^^^^^^^^^^^^^^^
...
37 |     pub fn can_retry(&self) -> bool {
   |            ^^^^^^^^^

warning: fields `pending`, `executing`, `priority_queue`, and `max_queue_size` are never read
  --> src/command/queue.rs:61:5
   |
60 | pub struct CommandQueue {
   |            ------------ fields in this struct
61 |     pending: Arc<DashMap<String, QueuedCommand>>, // correlation_id -> command
   |     ^^^^^^^
62 |     executing: Arc<DashMap<String, QueuedCommand>>, // correlation_id -> command
   |     ^^^^^^^^^
...
65 |     priority_queue: Arc<RwLock<BinaryHeap<QueuedCommand>>>,
   |     ^^^^^^^^^^^^^^
66 |     max_queue_size: usize,
   |     ^^^^^^^^^^^^^^
   |
   = note: `CommandQueue` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis

warning: multiple methods are never used
   --> src/command/queue.rs:82:18
    |
69  | impl CommandQueue {
    | ----------------- methods in this implementation
...
82  |     pub async fn enqueue(&self, command: CommandRecord) -> BackendAgentResult<()> {
    |                  ^^^^^^^
...
112 |     pub async fn dequeue(&self) -> Option<QueuedCommand> {
    |                  ^^^^^^^
...
136 |     pub async fn mark_completed(
    |                  ^^^^^^^^^^^^^^
...
162 |     pub async fn mark_failed(
    |                  ^^^^^^^^^^^
...
188 |     pub async fn retry_command(&self, correlation_id: &str) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^
...
227 |     pub async fn get_command(&self, correlation_id: &str) -> Option<QueuedCommand> {
    |                  ^^^^^^^^^^^
...
245 |     pub async fn get_pending_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^
...
250 |     pub async fn get_executing_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
255 |     pub async fn get_completed_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
260 |     pub async fn get_failed_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^
...
265 |     pub async fn get_statistics(&self) -> QueueStatistics {
    |                  ^^^^^^^^^^^^^^
...
329 |     pub async fn get_commands_by_status(&self, status: &CommandStatus) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
340 |     pub async fn get_commands_by_priority(&self, priority: &CommandPriority) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^
...
359 |     pub async fn get_commands_for_agent(&self, agent_id: &str) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
390 |     pub async fn get_commands_by_verb(&self, verb: &str) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^

warning: struct `QueueStatistics` is never constructed
   --> src/command/queue.rs:422:12
    |
422 | pub struct QueueStatistics {
    |            ^^^^^^^^^^^^^^^

warning: method `health_check` is never used
  --> src/data/mod.rs:27:18
   |
19 | impl DataLayer {
   | -------------- method in this implementation
...
27 |     pub async fn health_check(&self) -> BackendAgentResult<()> {
   |                  ^^^^^^^^^^^^

warning: field `config` is never read
  --> src/data/postgres.rs:11:9
   |
9  | pub struct PostgresClient {
   |            -------------- field in this struct
10 |     pub pool: sqlx::PgPool,
11 |     pub config: DatabaseConfig,
   |         ^^^^^^
   |
   = note: `PostgresClient` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis

warning: multiple methods are never used
   --> src/data/postgres.rs:50:18
    |
14  | impl PostgresClient {
    | ------------------- methods in this implementation
...
50  |     pub async fn health_check(&self) -> Result<(), BackendAgentError> {
    |                  ^^^^^^^^^^^^
...
69  |     pub fn get_pool(&self) -> &PgPool {
    |            ^^^^^^^^
...
238 |     pub async fn upsert_agent(&self, agent: &AgentInfo) -> Result<(), BackendAgentError> {
    |                  ^^^^^^^^^^^^
...
280 |     pub async fn get_agent(&self, agent_id: &str) -> Result<Option<AgentInfo>, BackendAgentError> {
    |                  ^^^^^^^^^
...
319 |     pub async fn list_agents(&self) -> Result<Vec<AgentInfo>, BackendAgentError> {
    |                  ^^^^^^^^^^^
...
354 |     pub async fn update_agent_status(
    |                  ^^^^^^^^^^^^^^^^^^^
...
378 |     pub async fn create_command(&self, command: &CommandRecord) -> Result<(), BackendAgentError> {
    |                  ^^^^^^^^^^^^^^
...
409 |     pub async fn get_command(
    |                  ^^^^^^^^^^^
...
458 |     pub async fn update_command_status(
    |                  ^^^^^^^^^^^^^^^^^^^^^
...
482 |     pub async fn store_telemetry(
    |                  ^^^^^^^^^^^^^^^
...
522 |     pub async fn get_latest_telemetry(
    |                  ^^^^^^^^^^^^^^^^^^^^
...
574 |     pub async fn log_audit_event(&self, audit_log: &AuditLog) -> Result<(), BackendAgentError> {
    |                  ^^^^^^^^^^^^^^^

warning: fields `client`, `manager`, and `config` are never read
  --> src/data/redis.rs:8:9
   |
7  | pub struct RedisClient {
   |            ----------- fields in this struct
8  |     pub client: Client,
   |         ^^^^^^
9  |     pub manager: ConnectionManager,
   |         ^^^^^^^
10 |     pub config: RedisConfig,
   |         ^^^^^^

warning: multiple methods are never used
   --> src/data/redis.rs:48:18
    |
13  | impl RedisClient {
    | ---------------- methods in this implementation
...
48  |     pub async fn health_check(&self) -> Result<(), BackendAgentError> {
    |                  ^^^^^^^^^^^^
...
68  |     pub fn get_manager(&self) -> &ConnectionManager {
    |            ^^^^^^^^^^^
...
76  |     pub async fn set(
    |                  ^^^
...
110 |     pub async fn get(&self, key: &str) -> Result<Option<String>, BackendAgentError> {
    |                  ^^^
...
125 |     pub async fn del(&self, key: &str) -> Result<(), BackendAgentError> {
    |                  ^^^
...
140 |     pub async fn exists(&self, key: &str) -> Result<bool, BackendAgentError> {
    |                  ^^^^^^
...
159 |     pub async fn hset(&self, key: &str, field: &str, value: &str) -> Result<(), BackendAgentError> {
    |                  ^^^^
...
176 |     pub async fn hget(&self, key: &str, field: &str) -> Result<Option<String>, BackendAgentError> {
    |                  ^^^^
...
194 |     pub async fn hgetall(&self, key: &str) -> Result<Vec<(String, String)>, BackendAgentError> {
    |                  ^^^^^^^
...
213 |     pub async fn lpush(&self, key: &str, value: &str) -> Result<(), BackendAgentError> {
    |                  ^^^^^
...
229 |     pub async fn rpop(&self, key: &str) -> Result<Option<String>, BackendAgentError> {
    |                  ^^^^
...
248 |     pub async fn sadd(&self, key: &str, member: &str) -> Result<(), BackendAgentError> {
    |                  ^^^^
...
264 |     pub async fn smembers(&self, key: &str) -> Result<Vec<String>, BackendAgentError> {
    |                  ^^^^^^^^
...
283 |     pub async fn expire(&self, key: &str, seconds: u64) -> Result<bool, BackendAgentError> {
    |                  ^^^^^^
...
299 |     pub async fn ttl(&self, key: &str) -> Result<i64, BackendAgentError> {
    |                  ^^^

warning: variants `Authentication`, `Authorization`, `CommandExecution`, `Connection`, and `RateLimit` are never constructed
  --> src/error.rs:21:5
   |
7  | pub enum BackendAgentError {
   |          ----------------- variants in this enum
...
21 |     Authentication(String),
   |     ^^^^^^^^^^^^^^
...
24 |     Authorization(String),
   |     ^^^^^^^^^^^^^
...
27 |     CommandExecution(String),
   |     ^^^^^^^^^^^^^^^^
...
36 |     Connection(String),
   |     ^^^^^^^^^^
...
45 |     RateLimit(String),
   |     ^^^^^^^^^
   |
   = note: `BackendAgentError` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis

warning: field `data_layer` is never read
 --> src/telemetry/analytics.rs:9:5
  |
8 | pub struct TelemetryAnalytics {
  |            ------------------ field in this struct
9 |     data_layer: DataLayer,
  |     ^^^^^^^^^^

warning: multiple methods are never used
   --> src/telemetry/analytics.rs:18:18
    |
12  | impl TelemetryAnalytics {
    | ----------------------- methods in this implementation
...
18  |     pub async fn process_telemetry(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^^
...
38  |     async fn check_cpu_alerts(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^
...
62  |     async fn check_memory_alerts(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^
...
87  |     async fn check_disk_alerts(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^
...
116 |     async fn check_container_alerts(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^
...
142 |     pub async fn get_statistics(&self) -> AnalyticsStats {
    |                  ^^^^^^^^^^^^^^
...
153 |     pub async fn generate_health_report(
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
236 |     pub async fn get_resource_trends(
    |                  ^^^^^^^^^^^^^^^^^^^

warning: struct `AnalyticsStats` is never constructed
   --> src/telemetry/analytics.rs:262:12
    |
262 | pub struct AnalyticsStats {
    |            ^^^^^^^^^^^^^^

warning: struct `HealthReport` is never constructed
   --> src/telemetry/analytics.rs:270:12
    |
270 | pub struct HealthReport {
    |            ^^^^^^^^^^^^

warning: struct `AgentHealthSummary` is never constructed
   --> src/telemetry/analytics.rs:282:12
    |
282 | pub struct AgentHealthSummary {
    |            ^^^^^^^^^^^^^^^^^^

warning: struct `ResourceTrends` is never constructed
   --> src/telemetry/analytics.rs:292:12
    |
292 | pub struct ResourceTrends {
    |            ^^^^^^^^^^^^^^

warning: fields `config`, `data_layer`, `telemetry_queue`, `telemetry_receiver`, and `is_running` are never read
  --> src/telemetry/processor.rs:13:5
   |
12 | pub struct TelemetryProcessor {
   |            ------------------ fields in this struct
13 |     config: Config,
   |     ^^^^^^
14 |     data_layer: DataLayer,
   |     ^^^^^^^^^^
...
17 |     telemetry_queue: Arc<mpsc::UnboundedSender<TelemetryMessage>>,
   |     ^^^^^^^^^^^^^^^
18 |     telemetry_receiver: Arc<RwLock<Option<mpsc::UnboundedReceiver<TelemetryMessage>>>>,
   |     ^^^^^^^^^^^^^^^^^^
19 |     is_running: Arc<RwLock<bool>>,
   |     ^^^^^^^^^^

warning: multiple methods are never used
   --> src/telemetry/processor.rs:49:18
    |
22  | impl TelemetryProcessor {
    | ----------------------- methods in this implementation
...
49  |     pub async fn start(&self) -> BackendAgentResult<()> {
    |                  ^^^^^
...
62  |     pub async fn stop(&self) -> BackendAgentResult<()> {
    |                  ^^^^
...
75  |     pub async fn process_telemetry(
    |                  ^^^^^^^^^^^^^^^^^
...
130 |     pub async fn queue_telemetry(&self, telemetry_msg: TelemetryMessage) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^
...
141 |     pub async fn run_processing_loop(&self) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^^^^
...
172 |     pub async fn get_statistics(&self) -> TelemetryStats {
    |                  ^^^^^^^^^^^^^^
...
183 |     pub async fn get_latest_telemetry(
    |                  ^^^^^^^^^^^^^^^^^^^^
...
191 |     pub async fn get_telemetry_history(
    |                  ^^^^^^^^^^^^^^^^^^^^^

warning: struct `TelemetryStats` is never constructed
   --> src/telemetry/processor.rs:253:12
    |
253 | pub struct TelemetryStats {
    |            ^^^^^^^^^^^^^^

warning: field `data_layer` is never read
 --> src/telemetry/storage.rs:8:5
  |
7 | pub struct TelemetryStorage {
  |            ---------------- field in this struct
8 |     data_layer: DataLayer,
  |     ^^^^^^^^^^

warning: multiple methods are never used
   --> src/telemetry/storage.rs:17:18
    |
11  | impl TelemetryStorage {
    | --------------------- methods in this implementation
...
17  |     pub async fn store_telemetry(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^
...
44  |     pub async fn get_latest_telemetry(
    |                  ^^^^^^^^^^^^^^^^^^^^
...
90  |     pub async fn get_telemetry_history(
    |                  ^^^^^^^^^^^^^^^^^^^^^
...
133 |     pub async fn get_telemetry_for_agents(
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^
...
170 |     pub async fn get_statistics(&self) -> StorageStats {
    |                  ^^^^^^^^^^^^^^
...
182 |     pub async fn batch_store_telemetry(
    |                  ^^^^^^^^^^^^^^^^^^^^^
...
206 |     pub async fn get_telemetry_summary(
    |                  ^^^^^^^^^^^^^^^^^^^^^

warning: struct `StorageStats` is never constructed
   --> src/telemetry/storage.rs:250:12
    |
250 | pub struct StorageStats {
    |            ^^^^^^^^^^^^

warning: struct `TelemetrySummary` is never constructed
   --> src/telemetry/storage.rs:259:12
    |
259 | pub struct TelemetrySummary {
    |            ^^^^^^^^^^^^^^^^

warning: redundant closure
   --> src/agent/connection.rs:147:22
    |
147 |             .map_err(|e| crate::error::BackendAgentError::Serialization(e))?;
    |                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ help: replace the closure with the function itself: `crate::error::BackendAgentError::Serialization`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#redundant_closure
    = note: `-W clippy::redundant-closure` implied by `-W clippy::all`
    = help: to override `-W clippy::all` add `#[allow(clippy::redundant_closure)]`

warning: redundant closure
   --> src/agent/connection.rs:152:30
    |
152 |                     .map_err(|e| crate::error::BackendAgentError::Serialization(e))?;
    |                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ help: replace the closure with the function itself: `crate::error::BackendAgentError::Serialization`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#redundant_closure

warning: redundant closure
   --> src/agent/connection.rs:158:34
    |
158 |                         .map_err(|e| crate::error::BackendAgentError::Serialization(e))?;
    |                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ help: replace the closure with the function itself: `crate::error::BackendAgentError::Serialization`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#redundant_closure

warning: redundant closure
   --> src/agent/connection.rs:163:30
    |
163 |                     .map_err(|e| crate::error::BackendAgentError::Serialization(e))?;
    |                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ help: replace the closure with the function itself: `crate::error::BackendAgentError::Serialization`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#redundant_closure

warning: redundant closure
   --> src/agent/connection.rs:169:34
    |
169 |                         .map_err(|e| crate::error::BackendAgentError::Serialization(e))?;
    |                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ help: replace the closure with the function itself: `crate::error::BackendAgentError::Serialization`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#redundant_closure

warning: this match could be written as a `let` statement
  --> src/api/handlers.rs:70:5
   |
70 | /     match agent_manager.list_agents().await {
71 | |         agents => {
72 | |             let response = AgentListResponse {
73 | |                 total: agents.len(),
...  |
78 | |     }
   | |_____^
   |
   = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#match_single_binding
   = note: `-W clippy::match-single-binding` implied by `-W clippy::all`
   = help: to override `-W clippy::all` add `#[allow(clippy::match_single_binding)]`
help: consider using a `let` statement
   |
70 ~     let agents = agent_manager.list_agents().await;
71 +     {
72 +         let response = AgentListResponse {
73 +             total: agents.len(),
74 +             agents,
75 +         };
76 +         Ok(HttpResponse::Ok().json(response))
77 +     }
   |

warning: this `impl` can be derived
   --> src/config.rs:253:1
    |
253 | / impl Default for Config {
254 | |     fn default() -> Self {
255 | |         Self {
256 | |             server: ServerConfig::default(),
...   |
266 | | }
    | |_^
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#derivable_impls
    = note: `-W clippy::derivable-impls` implied by `-W clippy::all`
    = help: to override `-W clippy::all` add `#[allow(clippy::derivable_impls)]`
help: replace the manual implementation with a derive attribute
    |
5   + #[derive(Default)]
6   ~ pub struct Config {
    |

warning: redundant closure
   --> src/data/postgres.rs:257:22
    |
257 |             .map_err(|e| BackendAgentError::Serialization(e))?;
    |                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ help: replace the closure with the function itself: `BackendAgentError::Serialization`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#redundant_closure

warning: the borrowed expression implements the required traits
   --> src/data/postgres.rs:268:19
    |
268 |             .bind(&agent.last_seen)
    |                   ^^^^^^^^^^^^^^^^ help: change this to: `agent.last_seen`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#needless_borrows_for_generic_args
    = note: `-W clippy::needless-borrows-for-generic-args` implied by `-W clippy::all`
    = help: to override `-W clippy::all` add `#[allow(clippy::needless_borrows_for_generic_args)]`

warning: redundant closure
   --> src/data/postgres.rs:387:22
    |
387 |             .map_err(|e| BackendAgentError::Serialization(e))?;
    |                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ help: replace the closure with the function itself: `BackendAgentError::Serialization`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#redundant_closure

warning: the borrowed expression implements the required traits
   --> src/data/postgres.rs:397:19
    |
397 |             .bind(&command.scheduled_at)
    |                   ^^^^^^^^^^^^^^^^^^^^^ help: change this to: `command.scheduled_at`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#needless_borrows_for_generic_args

warning: the borrowed expression implements the required traits
   --> src/data/postgres.rs:398:19
    |
398 |             .bind(&command.max_retries)
    |                   ^^^^^^^^^^^^^^^^^^^^ help: change this to: `command.max_retries`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#needless_borrows_for_generic_args

warning: redundant closure
   --> src/data/postgres.rs:428:30
    |
428 |                     .map_err(|e| BackendAgentError::Serialization(e))?;
    |                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ help: replace the closure with the function itself: `BackendAgentError::Serialization`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#redundant_closure

warning: redundant closure
   --> src/data/postgres.rs:494:22
    |
494 |             .map_err(|e| BackendAgentError::Serialization(e))?;
    |                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ help: replace the closure with the function itself: `BackendAgentError::Serialization`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#redundant_closure

warning: redundant closure
   --> src/data/postgres.rs:496:22
    |
496 |             .map_err(|e| BackendAgentError::Serialization(e))?;
    |                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ help: replace the closure with the function itself: `BackendAgentError::Serialization`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#redundant_closure

warning: the borrowed expression implements the required traits
   --> src/data/postgres.rs:504:19
    |
504 |             .bind(&telemetry.timestamp)
    |                   ^^^^^^^^^^^^^^^^^^^^ help: change this to: `telemetry.timestamp`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#needless_borrows_for_generic_args

warning: the borrowed expression implements the required traits
   --> src/data/postgres.rs:505:19
    |
505 |             .bind(&telemetry.cpu_usage)
    |                   ^^^^^^^^^^^^^^^^^^^^ help: change this to: `telemetry.cpu_usage`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#needless_borrows_for_generic_args

warning: the borrowed expression implements the required traits
   --> src/data/postgres.rs:509:19
    |
509 |             .bind(&telemetry.container_count)
    |                   ^^^^^^^^^^^^^^^^^^^^^^^^^^ help: change this to: `telemetry.container_count`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#needless_borrows_for_generic_args

warning: redundant closure
   --> src/data/postgres.rs:541:30
    |
541 |                     .map_err(|e| BackendAgentError::Serialization(e))?;
    |                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ help: replace the closure with the function itself: `BackendAgentError::Serialization`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#redundant_closure

warning: redundant closure
   --> src/data/postgres.rs:545:30
    |
545 |                     .map_err(|e| BackendAgentError::Serialization(e))?;
    |                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ help: replace the closure with the function itself: `BackendAgentError::Serialization`
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#redundant_closure

warning: unnecessary closure used to substitute value for `Result::Err`
   --> src/telemetry/processor.rs:105:21
    |
105 | /                     serde_json::from_value(n).unwrap_or_else(|_| NetworkStats {
106 | |                         bytes_sent: 0,
107 | |                         bytes_received: 0,
108 | |                         packets_sent: 0,
109 | |                         packets_received: 0,
110 | |                         connections_active: 0,
111 | |                     })
    | |______________________^
    |
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#unnecessary_lazy_evaluations
    = note: `-W clippy::unnecessary-lazy-evaluations` implied by `-W clippy::all`
    = help: to override `-W clippy::all` add `#[allow(clippy::unnecessary_lazy_evaluations)]`
help: use `unwrap_or` instead
    |
105 ~                     serde_json::from_value(n).unwrap_or(NetworkStats {
106 +                         bytes_sent: 0,
107 +                         bytes_received: 0,
108 +                         packets_sent: 0,
109 +                         packets_received: 0,
110 +                         connections_active: 0,
111 +                     })
    |

warning: redundant closure
  --> src/telemetry/storage.rs:25:22
   |
25 |             .map_err(|e| crate::error::BackendAgentError::Serialization(e))?;
   |                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ help: replace the closure with the function itself: `crate::error::BackendAgentError::Serialization`
   |
   = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#redundant_closure

warning: redundant closure
  --> src/telemetry/storage.rs:69:26
   |
69 |                 .map_err(|e| crate::error::BackendAgentError::Serialization(e))?;
   |                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ help: replace the closure with the function itself: `crate::error::BackendAgentError::Serialization`
   |
   = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#redundant_closure

warning: `viworks-backend-agent` (bin "viworks-backend-agent") generated 128 warnings (run `cargo clippy --fix --bin "viworks-backend-agent"` to apply 53 suggestions)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 7.89s
warning: the following packages contain code that will be rejected by a future version of Rust: redis v0.24.0, sqlx-postgres v0.7.4
note: to see what the problems were, use the option `--future-incompat-report`, or run `cargo report future-incompatibilities --id 1`
0s
Post job cleanup.
Cache hit occurred on the primary key Linux-cargo-0e17d64bec7e0b6bd0aa227fa06120aa97a87289cb926d622a12fe56b19f6a4f, not saving cache.
0s
Post job cleanup.
/usr/bin/git version
git version 2.51.0
Temporarily overriding HOME='/home/runner/work/_temp/da21f6e8-6246-4a55-b051-869f7fac33eb' before making global git config changes
Adding repository directory to the temporary git global config as a safe directory
/usr/bin/git config --global --add safe.directory /home/runner/work/viworkdemo002/viworkdemo002
/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
http.https://github.com/.extraheader
/usr/bin/git config --local --unset-all http.https://github.com/.extraheader
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
0s
Cleaning up orphan processes


step2: 
Build Backend Agent (Replicated Process)
succeeded 1 minute ago in 3m 48s

2s
Current runner version: '2.328.0'
Runner Image Provisioner
Operating System
Runner Image
GITHUB_TOKEN Permissions
Secret source: Actions
Prepare workflow directory
Prepare all required actions
Getting action download info
Download action repository 'actions/checkout@v4' (SHA:08eba0b27e820071cde6df949e0beb9ba4906955)
Download action repository 'docker/setup-buildx-action@v3' (SHA:e468171a9de216ec08956ac3ada2f0791b6bd435)
Download action repository 'actions/upload-artifact@v4' (SHA:ea165f8d65b6e75b540449e92b4886f43607fa02)
Complete job name: Build Backend Agent (Replicated Process)
2s
Run actions/checkout@v4
Syncing repository: apebrahimi/viworkdemo002
Getting Git version info
Temporarily overriding HOME='/home/runner/work/_temp/1924aa51-c935-4bf7-a0b6-22d3186ae2d3' before making global git config changes
Adding repository directory to the temporary git global config as a safe directory
/usr/bin/git config --global --add safe.directory /home/runner/work/viworkdemo002/viworkdemo002
Deleting the contents of '/home/runner/work/viworkdemo002/viworkdemo002'
Initializing the repository
Disabling automatic garbage collection
Setting up auth
Fetching the repository
Determining the checkout info
/usr/bin/git sparse-checkout disable
/usr/bin/git config --local --unset-all extensions.worktreeConfig
Checking out the ref
/usr/bin/git log -1 --format=%H
f6461d8be73871f5de720a5933e3f1005a4486be
8s
Run docker/setup-buildx-action@v3
Docker info
Buildx version
Inspecting default docker context
Creating a new builder instance
Booting builder
Inspect builder
BuildKit version
9s
Run # Create the exact same build container as used on server
Unable to find image 'debian:latest' locally
latest: Pulling from library/debian
80b7316254b3: Pulling fs layer
80b7316254b3: Verifying Checksum
80b7316254b3: Download complete
80b7316254b3: Pull complete
Digest: sha256:6d87375016340817ac2391e670971725a9981cfc24e221c47734681ed0f6c0f5
Status: Downloaded newer image for debian:latest
c8930fdbee8485b5a6da0334fbbe3b75ad738dcf87a0a5e4ec3b90d3f18e8cac
c8930fdbee84   debian:latest                   "tail -f /dev/null"      6 seconds ago    Up 5 seconds             viworks-build-temp
0s
Run # Package source code exactly as done on server
-rw-r--r-- 1 runner docker 81382 Sep  5 12:12 ../backend-agent-source.tar.gz
Source package created: 80K
0s
Run # Copy source code to build container (replicate server process)
-rw-r--r-- 1 1001 118 81382 Sep  5 12:12 /tmp/backend-agent-source.tar.gz
3m 17s
Get:58 http://deb.debian.org/debian trixie/main amd64 g++ amd64 4:14.2.0-1 [1344 B]
Get:59 http://deb.debian.org/debian trixie/main amd64 make amd64 4.4.1-2 [463 kB]
Get:60 http://deb.debian.org/debian trixie/main amd64 libdpkg-perl all 1.22.21 [650 kB]
Get:61 http://deb.debian.org/debian trixie/main amd64 patch amd64 2.8-2 [134 kB]
Get:62 http://deb.debian.org/debian trixie/main amd64 dpkg-dev all 1.22.21 [1338 kB]
Get:63 http://deb.debian.org/debian trixie/main amd64 build-essential amd64 12.12 [4624 B]
Get:64 http://deb.debian.org/debian trixie/main amd64 libbrotli1 amd64 1.1.0-2+b7 [307 kB]
Get:65 http://deb.debian.org/debian trixie/main amd64 libkrb5support0 amd64 1.21.3-5 [33.0 kB]
Get:66 http://deb.debian.org/debian trixie/main amd64 libcom-err2 amd64 1.47.2-3+b3 [25.0 kB]
Get:67 http://deb.debian.org/debian trixie/main amd64 libk5crypto3 amd64 1.21.3-5 [81.5 kB]
Get:68 http://deb.debian.org/debian trixie/main amd64 libkeyutils1 amd64 1.6.3-6 [9456 B]
Get:69 http://deb.debian.org/debian trixie/main amd64 libkrb5-3 amd64 1.21.3-5 [326 kB]
Get:70 http://deb.debian.org/debian trixie/main amd64 libgssapi-krb5-2 amd64 1.21.3-5 [138 kB]
Get:71 http://deb.debian.org/debian trixie/main amd64 libunistring5 amd64 1.3-2 [477 kB]
Get:72 http://deb.debian.org/debian trixie/main amd64 libidn2-0 amd64 2.3.8-2 [109 kB]
Get:73 http://deb.debian.org/debian trixie/main amd64 libsasl2-modules-db amd64 2.1.28+dfsg1-9 [19.8 kB]
Get:74 http://deb.debian.org/debian trixie/main amd64 libsasl2-2 amd64 2.1.28+dfsg1-9 [57.5 kB]
Get:75 http://deb.debian.org/debian trixie/main amd64 libldap2 amd64 2.6.10+dfsg-1 [194 kB]
Get:76 http://deb.debian.org/debian trixie/main amd64 libnghttp2-14 amd64 1.64.0-1.1 [76.0 kB]
Get:77 http://deb.debian.org/debian trixie/main amd64 libnghttp3-9 amd64 1.8.0-1 [67.7 kB]
Get:78 http://deb.debian.org/debian trixie/main amd64 libpsl5t64 amd64 0.21.2-1.1+b1 [57.2 kB]
Get:79 http://deb.debian.org/debian trixie/main amd64 libffi8 amd64 3.4.8-2 [24.1 kB]
Get:80 http://deb.debian.org/debian trixie/main amd64 libp11-kit0 amd64 0.25.5-3 [425 kB]
Get:81 http://deb.debian.org/debian trixie/main amd64 libtasn1-6 amd64 4.20.0-2 [49.9 kB]
Get:82 http://deb.debian.org/debian trixie/main amd64 libgnutls30t64 amd64 3.8.9-3 [1465 kB]
Get:83 http://deb.debian.org/debian trixie/main amd64 librtmp1 amd64 2.4+20151223.gitfa8646d.1-2+b5 [58.8 kB]
Get:84 http://deb.debian.org/debian trixie/main amd64 libssh2-1t64 amd64 1.11.1-1 [245 kB]
Get:85 http://deb.debian.org/debian trixie/main amd64 libcurl4t64 amd64 8.14.1-2 [391 kB]
Get:86 http://deb.debian.org/debian trixie/main amd64 curl amd64 8.14.1-2 [269 kB]
Get:87 http://deb.debian.org/debian trixie/main amd64 libfakeroot amd64 1.37.1.1-1 [29.6 kB]
Get:88 http://deb.debian.org/debian trixie/main amd64 fakeroot amd64 1.37.1.1-1 [76.0 kB]
Get:89 http://deb.debian.org/debian trixie/main amd64 libalgorithm-diff-perl all 1.201-1 [43.3 kB]
Get:90 http://deb.debian.org/debian trixie/main amd64 libalgorithm-diff-xs-perl amd64 0.04-9 [11.1 kB]
Get:91 http://deb.debian.org/debian trixie/main amd64 libalgorithm-merge-perl all 0.08-5 [11.8 kB]
Get:92 http://deb.debian.org/debian trixie/main amd64 libfile-fcntllock-perl amd64 0.22-4+b4 [34.6 kB]
Get:93 http://deb.debian.org/debian trixie/main amd64 libldap-common all 2.6.10+dfsg-1 [35.1 kB]
Get:94 http://deb.debian.org/debian trixie/main amd64 libpkgconf3 amd64 1.8.1-4 [36.4 kB]
Get:95 http://deb.debian.org/debian trixie/main amd64 libsasl2-modules amd64 2.1.28+dfsg1-9 [66.7 kB]
Get:96 http://deb.debian.org/debian trixie/main amd64 libssl-dev amd64 3.5.1-1 [2954 kB]
Get:97 http://deb.debian.org/debian trixie/main amd64 manpages-dev all 6.9.1-1 [2122 kB]
Get:98 http://deb.debian.org/debian trixie/main amd64 pkgconf-bin amd64 1.8.1-4 [30.2 kB]
Get:99 http://deb.debian.org/debian trixie/main amd64 pkgconf amd64 1.8.1-4 [26.2 kB]
Get:100 http://deb.debian.org/debian trixie/main amd64 pkg-config amd64 1.8.1-4 [14.0 kB]
Get:101 http://deb.debian.org/debian trixie/main amd64 publicsuffix all 20250328.1952-0.1 [296 kB]
Get:102 http://deb.debian.org/debian trixie/main amd64 sq amd64 1.3.1-2+b1 [5654 kB]
debconf: unable to initialize frontend: Dialog
debconf: (TERM is not set, so the dialog frontend is not usable.)
debconf: falling back to frontend: Readline
debconf: unable to initialize frontend: Readline
debconf: (Can't locate Term/ReadLine.pm in @INC (you may need to install the Term::ReadLine module) (@INC entries checked: /etc/perl /usr/local/lib/x86_64-linux-gnu/perl/5.40.1 /usr/local/share/perl/5.40.1 /usr/lib/x86_64-linux-gnu/perl5/5.40 /usr/share/perl5 /usr/lib/x86_64-linux-gnu/perl-base /usr/lib/x86_64-linux-gnu/perl/5.40 /usr/share/perl/5.40 /usr/local/lib/site_perl) at /usr/share/perl5/Debconf/FrontEnd/Readline.pm line 8, <STDIN> line 102.)
debconf: falling back to frontend: Teletype
debconf: unable to initialize frontend: Teletype
debconf: (This frontend requires a controlling tty.)
debconf: falling back to frontend: Noninteractive
Preconfiguring packages ...
Fetched 103 MB in 0s (254 MB/s)
Selecting previously unselected package liblocale-gettext-perl.
(Reading database ... 
(Reading database ... 5%
(Reading database ... 10%
(Reading database ... 15%
(Reading database ... 20%
(Reading database ... 25%
(Reading database ... 30%
(Reading database ... 35%
(Reading database ... 40%
(Reading database ... 45%
(Reading database ... 50%
(Reading database ... 55%
(Reading database ... 60%
(Reading database ... 65%
(Reading database ... 70%
(Reading database ... 75%
(Reading database ... 80%
(Reading database ... 85%
(Reading database ... 90%
(Reading database ... 95%
(Reading database ... 100%
(Reading database ... 4934 files and directories currently installed.)
Preparing to unpack .../000-liblocale-gettext-perl_1.07-7+b1_amd64.deb ...
Unpacking liblocale-gettext-perl (1.07-7+b1) ...
Selecting previously unselected package netbase.
Preparing to unpack .../001-netbase_6.5_all.deb ...
Unpacking netbase (6.5) ...
Selecting previously unselected package bash-completion.
Preparing to unpack .../002-bash-completion_1%3a2.16.0-7_all.deb ...
Unpacking bash-completion (1:2.16.0-7) ...
Selecting previously unselected package bzip2.
Preparing to unpack .../003-bzip2_1.0.8-6_amd64.deb ...
Unpacking bzip2 (1.0.8-6) ...
Selecting previously unselected package openssl.
Preparing to unpack .../004-openssl_3.5.1-1_amd64.deb ...
Unpacking openssl (3.5.1-1) ...
Selecting previously unselected package ca-certificates.
Preparing to unpack .../005-ca-certificates_20250419_all.deb ...
Unpacking ca-certificates (20250419) ...
Selecting previously unselected package libmagic-mgc.
Preparing to unpack .../006-libmagic-mgc_1%3a5.46-5_amd64.deb ...
Unpacking libmagic-mgc (1:5.46-5) ...
Selecting previously unselected package libmagic1t64:amd64.
Preparing to unpack .../007-libmagic1t64_1%3a5.46-5_amd64.deb ...
Unpacking libmagic1t64:amd64 (1:5.46-5) ...
Selecting previously unselected package file.
Preparing to unpack .../008-file_1%3a5.46-5_amd64.deb ...
Unpacking file (1:5.46-5) ...
Selecting previously unselected package krb5-locales.
Preparing to unpack .../009-krb5-locales_1.21.3-5_all.deb ...
Unpacking krb5-locales (1.21.3-5) ...
Selecting previously unselected package manpages.
Preparing to unpack .../010-manpages_6.9.1-1_all.deb ...
Unpacking manpages (6.9.1-1) ...
Selecting previously unselected package perl-modules-5.40.
Preparing to unpack .../011-perl-modules-5.40_5.40.1-6_all.deb ...
Unpacking perl-modules-5.40 (5.40.1-6) ...
Selecting previously unselected package libgdbm6t64:amd64.
Preparing to unpack .../012-libgdbm6t64_1.24-2_amd64.deb ...
Unpacking libgdbm6t64:amd64 (1.24-2) ...
Selecting previously unselected package libgdbm-compat4t64:amd64.
Preparing to unpack .../013-libgdbm-compat4t64_1.24-2_amd64.deb ...
Unpacking libgdbm-compat4t64:amd64 (1.24-2) ...
Selecting previously unselected package libperl5.40:amd64.
Preparing to unpack .../014-libperl5.40_5.40.1-6_amd64.deb ...
Unpacking libperl5.40:amd64 (5.40.1-6) ...
Selecting previously unselected package perl.
Preparing to unpack .../015-perl_5.40.1-6_amd64.deb ...
Unpacking perl (5.40.1-6) ...
Selecting previously unselected package xz-utils.
Preparing to unpack .../016-xz-utils_5.8.1-1_amd64.deb ...
Unpacking xz-utils (5.8.1-1) ...
Selecting previously unselected package libsframe1:amd64.
Preparing to unpack .../017-libsframe1_2.44-3_amd64.deb ...
Unpacking libsframe1:amd64 (2.44-3) ...
Selecting previously unselected package binutils-common:amd64.
Preparing to unpack .../018-binutils-common_2.44-3_amd64.deb ...
Unpacking binutils-common:amd64 (2.44-3) ...
Selecting previously unselected package libbinutils:amd64.
Preparing to unpack .../019-libbinutils_2.44-3_amd64.deb ...
Unpacking libbinutils:amd64 (2.44-3) ...
Selecting previously unselected package libgprofng0:amd64.
Preparing to unpack .../020-libgprofng0_2.44-3_amd64.deb ...
Unpacking libgprofng0:amd64 (2.44-3) ...
Selecting previously unselected package libctf-nobfd0:amd64.
Preparing to unpack .../021-libctf-nobfd0_2.44-3_amd64.deb ...
Unpacking libctf-nobfd0:amd64 (2.44-3) ...
Selecting previously unselected package libctf0:amd64.
Preparing to unpack .../022-libctf0_2.44-3_amd64.deb ...
Unpacking libctf0:amd64 (2.44-3) ...
Selecting previously unselected package libjansson4:amd64.
Preparing to unpack .../023-libjansson4_2.14-2+b3_amd64.deb ...
Unpacking libjansson4:amd64 (2.14-2+b3) ...
Selecting previously unselected package binutils-x86-64-linux-gnu.
Preparing to unpack .../024-binutils-x86-64-linux-gnu_2.44-3_amd64.deb ...
Unpacking binutils-x86-64-linux-gnu (2.44-3) ...
Selecting previously unselected package binutils.
Preparing to unpack .../025-binutils_2.44-3_amd64.deb ...
Unpacking binutils (2.44-3) ...
Selecting previously unselected package libc-dev-bin.
Preparing to unpack .../026-libc-dev-bin_2.41-12_amd64.deb ...
Unpacking libc-dev-bin (2.41-12) ...
Selecting previously unselected package linux-libc-dev.
Preparing to unpack .../027-linux-libc-dev_6.12.41-1_all.deb ...
Unpacking linux-libc-dev (6.12.41-1) ...
Selecting previously unselected package libcrypt-dev:amd64.
Preparing to unpack .../028-libcrypt-dev_1%3a4.4.38-1_amd64.deb ...
Unpacking libcrypt-dev:amd64 (1:4.4.38-1) ...
Selecting previously unselected package rpcsvc-proto.
Preparing to unpack .../029-rpcsvc-proto_1.4.3-1_amd64.deb ...
Unpacking rpcsvc-proto (1.4.3-1) ...
Selecting previously unselected package libc6-dev:amd64.
Preparing to unpack .../030-libc6-dev_2.41-12_amd64.deb ...
Unpacking libc6-dev:amd64 (2.41-12) ...
Selecting previously unselected package libisl23:amd64.
Preparing to unpack .../031-libisl23_0.27-1_amd64.deb ...
Unpacking libisl23:amd64 (0.27-1) ...
Selecting previously unselected package libmpfr6:amd64.
Preparing to unpack .../032-libmpfr6_4.2.2-1_amd64.deb ...
Unpacking libmpfr6:amd64 (4.2.2-1) ...
Selecting previously unselected package libmpc3:amd64.
Preparing to unpack .../033-libmpc3_1.3.1-1+b3_amd64.deb ...
Unpacking libmpc3:amd64 (1.3.1-1+b3) ...
Selecting previously unselected package cpp-14-x86-64-linux-gnu.
Preparing to unpack .../034-cpp-14-x86-64-linux-gnu_14.2.0-19_amd64.deb ...
Unpacking cpp-14-x86-64-linux-gnu (14.2.0-19) ...
Selecting previously unselected package cpp-14.
Preparing to unpack .../035-cpp-14_14.2.0-19_amd64.deb ...
Unpacking cpp-14 (14.2.0-19) ...
Selecting previously unselected package cpp-x86-64-linux-gnu.
Preparing to unpack .../036-cpp-x86-64-linux-gnu_4%3a14.2.0-1_amd64.deb ...
Unpacking cpp-x86-64-linux-gnu (4:14.2.0-1) ...
Selecting previously unselected package cpp.
Preparing to unpack .../037-cpp_4%3a14.2.0-1_amd64.deb ...
Unpacking cpp (4:14.2.0-1) ...
Selecting previously unselected package libcc1-0:amd64.
Preparing to unpack .../038-libcc1-0_14.2.0-19_amd64.deb ...
Unpacking libcc1-0:amd64 (14.2.0-19) ...
Selecting previously unselected package libgomp1:amd64.
Preparing to unpack .../039-libgomp1_14.2.0-19_amd64.deb ...
Unpacking libgomp1:amd64 (14.2.0-19) ...
Selecting previously unselected package libitm1:amd64.
Preparing to unpack .../040-libitm1_14.2.0-19_amd64.deb ...
Unpacking libitm1:amd64 (14.2.0-19) ...
Selecting previously unselected package libatomic1:amd64.
Preparing to unpack .../041-libatomic1_14.2.0-19_amd64.deb ...
Unpacking libatomic1:amd64 (14.2.0-19) ...
Selecting previously unselected package libasan8:amd64.
Preparing to unpack .../042-libasan8_14.2.0-19_amd64.deb ...
Unpacking libasan8:amd64 (14.2.0-19) ...
Selecting previously unselected package liblsan0:amd64.
Preparing to unpack .../043-liblsan0_14.2.0-19_amd64.deb ...
Unpacking liblsan0:amd64 (14.2.0-19) ...
Selecting previously unselected package libtsan2:amd64.
Preparing to unpack .../044-libtsan2_14.2.0-19_amd64.deb ...
Unpacking libtsan2:amd64 (14.2.0-19) ...
Selecting previously unselected package libubsan1:amd64.
Preparing to unpack .../045-libubsan1_14.2.0-19_amd64.deb ...
Unpacking libubsan1:amd64 (14.2.0-19) ...
Selecting previously unselected package libhwasan0:amd64.
Preparing to unpack .../046-libhwasan0_14.2.0-19_amd64.deb ...
Unpacking libhwasan0:amd64 (14.2.0-19) ...
Selecting previously unselected package libquadmath0:amd64.
Preparing to unpack .../047-libquadmath0_14.2.0-19_amd64.deb ...
Unpacking libquadmath0:amd64 (14.2.0-19) ...
Selecting previously unselected package libgcc-14-dev:amd64.
Preparing to unpack .../048-libgcc-14-dev_14.2.0-19_amd64.deb ...
Unpacking libgcc-14-dev:amd64 (14.2.0-19) ...
Selecting previously unselected package gcc-14-x86-64-linux-gnu.
Preparing to unpack .../049-gcc-14-x86-64-linux-gnu_14.2.0-19_amd64.deb ...
Unpacking gcc-14-x86-64-linux-gnu (14.2.0-19) ...
Selecting previously unselected package gcc-14.
Preparing to unpack .../050-gcc-14_14.2.0-19_amd64.deb ...
Unpacking gcc-14 (14.2.0-19) ...
Selecting previously unselected package gcc-x86-64-linux-gnu.
Preparing to unpack .../051-gcc-x86-64-linux-gnu_4%3a14.2.0-1_amd64.deb ...
Unpacking gcc-x86-64-linux-gnu (4:14.2.0-1) ...
Selecting previously unselected package gcc.
Preparing to unpack .../052-gcc_4%3a14.2.0-1_amd64.deb ...
Unpacking gcc (4:14.2.0-1) ...
Selecting previously unselected package libstdc++-14-dev:amd64.
Preparing to unpack .../053-libstdc++-14-dev_14.2.0-19_amd64.deb ...
Unpacking libstdc++-14-dev:amd64 (14.2.0-19) ...
Selecting previously unselected package g++-14-x86-64-linux-gnu.
Preparing to unpack .../054-g++-14-x86-64-linux-gnu_14.2.0-19_amd64.deb ...
Unpacking g++-14-x86-64-linux-gnu (14.2.0-19) ...
Selecting previously unselected package g++-14.
Preparing to unpack .../055-g++-14_14.2.0-19_amd64.deb ...
Unpacking g++-14 (14.2.0-19) ...
Selecting previously unselected package g++-x86-64-linux-gnu.
Preparing to unpack .../056-g++-x86-64-linux-gnu_4%3a14.2.0-1_amd64.deb ...
Unpacking g++-x86-64-linux-gnu (4:14.2.0-1) ...
Selecting previously unselected package g++.
Preparing to unpack .../057-g++_4%3a14.2.0-1_amd64.deb ...
Unpacking g++ (4:14.2.0-1) ...
Selecting previously unselected package make.
Preparing to unpack .../058-make_4.4.1-2_amd64.deb ...
Unpacking make (4.4.1-2) ...
Selecting previously unselected package libdpkg-perl.
Preparing to unpack .../059-libdpkg-perl_1.22.21_all.deb ...
Unpacking libdpkg-perl (1.22.21) ...
Selecting previously unselected package patch.
Preparing to unpack .../060-patch_2.8-2_amd64.deb ...
Unpacking patch (2.8-2) ...
Selecting previously unselected package dpkg-dev.
Preparing to unpack .../061-dpkg-dev_1.22.21_all.deb ...
Unpacking dpkg-dev (1.22.21) ...
Selecting previously unselected package build-essential.
Preparing to unpack .../062-build-essential_12.12_amd64.deb ...
Unpacking build-essential (12.12) ...
Selecting previously unselected package libbrotli1:amd64.
Preparing to unpack .../063-libbrotli1_1.1.0-2+b7_amd64.deb ...
Unpacking libbrotli1:amd64 (1.1.0-2+b7) ...
Selecting previously unselected package libkrb5support0:amd64.
Preparing to unpack .../064-libkrb5support0_1.21.3-5_amd64.deb ...
Unpacking libkrb5support0:amd64 (1.21.3-5) ...
Selecting previously unselected package libcom-err2:amd64.
Preparing to unpack .../065-libcom-err2_1.47.2-3+b3_amd64.deb ...
Unpacking libcom-err2:amd64 (1.47.2-3+b3) ...
Selecting previously unselected package libk5crypto3:amd64.
Preparing to unpack .../066-libk5crypto3_1.21.3-5_amd64.deb ...
Unpacking libk5crypto3:amd64 (1.21.3-5) ...
Selecting previously unselected package libkeyutils1:amd64.
Preparing to unpack .../067-libkeyutils1_1.6.3-6_amd64.deb ...
Unpacking libkeyutils1:amd64 (1.6.3-6) ...
Selecting previously unselected package libkrb5-3:amd64.
Preparing to unpack .../068-libkrb5-3_1.21.3-5_amd64.deb ...
Unpacking libkrb5-3:amd64 (1.21.3-5) ...
Selecting previously unselected package libgssapi-krb5-2:amd64.
Preparing to unpack .../069-libgssapi-krb5-2_1.21.3-5_amd64.deb ...
Unpacking libgssapi-krb5-2:amd64 (1.21.3-5) ...
Selecting previously unselected package libunistring5:amd64.
Preparing to unpack .../070-libunistring5_1.3-2_amd64.deb ...
Unpacking libunistring5:amd64 (1.3-2) ...
Selecting previously unselected package libidn2-0:amd64.
Preparing to unpack .../071-libidn2-0_2.3.8-2_amd64.deb ...
Unpacking libidn2-0:amd64 (2.3.8-2) ...
Selecting previously unselected package libsasl2-modules-db:amd64.
Preparing to unpack .../072-libsasl2-modules-db_2.1.28+dfsg1-9_amd64.deb ...
Unpacking libsasl2-modules-db:amd64 (2.1.28+dfsg1-9) ...
Selecting previously unselected package libsasl2-2:amd64.
Preparing to unpack .../073-libsasl2-2_2.1.28+dfsg1-9_amd64.deb ...
Unpacking libsasl2-2:amd64 (2.1.28+dfsg1-9) ...
Selecting previously unselected package libldap2:amd64.
Preparing to unpack .../074-libldap2_2.6.10+dfsg-1_amd64.deb ...
Unpacking libldap2:amd64 (2.6.10+dfsg-1) ...
Selecting previously unselected package libnghttp2-14:amd64.
Preparing to unpack .../075-libnghttp2-14_1.64.0-1.1_amd64.deb ...
Unpacking libnghttp2-14:amd64 (1.64.0-1.1) ...
Selecting previously unselected package libnghttp3-9:amd64.
Preparing to unpack .../076-libnghttp3-9_1.8.0-1_amd64.deb ...
Unpacking libnghttp3-9:amd64 (1.8.0-1) ...
Selecting previously unselected package libpsl5t64:amd64.
Preparing to unpack .../077-libpsl5t64_0.21.2-1.1+b1_amd64.deb ...
Unpacking libpsl5t64:amd64 (0.21.2-1.1+b1) ...
Selecting previously unselected package libffi8:amd64.
Preparing to unpack .../078-libffi8_3.4.8-2_amd64.deb ...
Unpacking libffi8:amd64 (3.4.8-2) ...
Selecting previously unselected package libp11-kit0:amd64.
Preparing to unpack .../079-libp11-kit0_0.25.5-3_amd64.deb ...
Unpacking libp11-kit0:amd64 (0.25.5-3) ...
Selecting previously unselected package libtasn1-6:amd64.
Preparing to unpack .../080-libtasn1-6_4.20.0-2_amd64.deb ...
Unpacking libtasn1-6:amd64 (4.20.0-2) ...
Selecting previously unselected package libgnutls30t64:amd64.
Preparing to unpack .../081-libgnutls30t64_3.8.9-3_amd64.deb ...
Unpacking libgnutls30t64:amd64 (3.8.9-3) ...
Selecting previously unselected package librtmp1:amd64.
Preparing to unpack .../082-librtmp1_2.4+20151223.gitfa8646d.1-2+b5_amd64.deb ...
Unpacking librtmp1:amd64 (2.4+20151223.gitfa8646d.1-2+b5) ...
Selecting previously unselected package libssh2-1t64:amd64.
Preparing to unpack .../083-libssh2-1t64_1.11.1-1_amd64.deb ...
Unpacking libssh2-1t64:amd64 (1.11.1-1) ...
Selecting previously unselected package libcurl4t64:amd64.
Preparing to unpack .../084-libcurl4t64_8.14.1-2_amd64.deb ...
Unpacking libcurl4t64:amd64 (8.14.1-2) ...
Selecting previously unselected package curl.
Preparing to unpack .../085-curl_8.14.1-2_amd64.deb ...
Unpacking curl (8.14.1-2) ...
Selecting previously unselected package libfakeroot:amd64.
Preparing to unpack .../086-libfakeroot_1.37.1.1-1_amd64.deb ...
Unpacking libfakeroot:amd64 (1.37.1.1-1) ...
Selecting previously unselected package fakeroot.
Preparing to unpack .../087-fakeroot_1.37.1.1-1_amd64.deb ...
Unpacking fakeroot (1.37.1.1-1) ...
Selecting previously unselected package libalgorithm-diff-perl.
Preparing to unpack .../088-libalgorithm-diff-perl_1.201-1_all.deb ...
Unpacking libalgorithm-diff-perl (1.201-1) ...
Selecting previously unselected package libalgorithm-diff-xs-perl.
Preparing to unpack .../089-libalgorithm-diff-xs-perl_0.04-9_amd64.deb ...
Unpacking libalgorithm-diff-xs-perl (0.04-9) ...
Selecting previously unselected package libalgorithm-merge-perl.
Preparing to unpack .../090-libalgorithm-merge-perl_0.08-5_all.deb ...
Unpacking libalgorithm-merge-perl (0.08-5) ...
Selecting previously unselected package libfile-fcntllock-perl.
Preparing to unpack .../091-libfile-fcntllock-perl_0.22-4+b4_amd64.deb ...
Unpacking libfile-fcntllock-perl (0.22-4+b4) ...
Selecting previously unselected package libldap-common.
Preparing to unpack .../092-libldap-common_2.6.10+dfsg-1_all.deb ...
Unpacking libldap-common (2.6.10+dfsg-1) ...
Selecting previously unselected package libpkgconf3:amd64.
Preparing to unpack .../093-libpkgconf3_1.8.1-4_amd64.deb ...
Unpacking libpkgconf3:amd64 (1.8.1-4) ...
Selecting previously unselected package libsasl2-modules:amd64.
Preparing to unpack .../094-libsasl2-modules_2.1.28+dfsg1-9_amd64.deb ...
Unpacking libsasl2-modules:amd64 (2.1.28+dfsg1-9) ...
Selecting previously unselected package libssl-dev:amd64.
Preparing to unpack .../095-libssl-dev_3.5.1-1_amd64.deb ...
Unpacking libssl-dev:amd64 (3.5.1-1) ...
Selecting previously unselected package manpages-dev.
Preparing to unpack .../096-manpages-dev_6.9.1-1_all.deb ...
Unpacking manpages-dev (6.9.1-1) ...
Selecting previously unselected package pkgconf-bin.
Preparing to unpack .../097-pkgconf-bin_1.8.1-4_amd64.deb ...
Unpacking pkgconf-bin (1.8.1-4) ...
Selecting previously unselected package pkgconf:amd64.
Preparing to unpack .../098-pkgconf_1.8.1-4_amd64.deb ...
Unpacking pkgconf:amd64 (1.8.1-4) ...
Selecting previously unselected package pkg-config:amd64.
Preparing to unpack .../099-pkg-config_1.8.1-4_amd64.deb ...
Unpacking pkg-config:amd64 (1.8.1-4) ...
Selecting previously unselected package publicsuffix.
Preparing to unpack .../100-publicsuffix_20250328.1952-0.1_all.deb ...
Unpacking publicsuffix (20250328.1952-0.1) ...
Selecting previously unselected package sq.
Preparing to unpack .../101-sq_1.3.1-2+b1_amd64.deb ...
Unpacking sq (1.3.1-2+b1) ...
Setting up libkeyutils1:amd64 (1.6.3-6) ...
Setting up libgdbm6t64:amd64 (1.24-2) ...
Setting up libgdbm-compat4t64:amd64 (1.24-2) ...
Setting up libmagic-mgc (1:5.46-5) ...
Setting up manpages (6.9.1-1) ...
Setting up libbrotli1:amd64 (1.1.0-2+b7) ...
Setting up libsasl2-modules:amd64 (2.1.28+dfsg1-9) ...
Setting up libmagic1t64:amd64 (1:5.46-5) ...
Setting up binutils-common:amd64 (2.44-3) ...
Setting up libnghttp2-14:amd64 (1.64.0-1.1) ...
Setting up linux-libc-dev (6.12.41-1) ...
Setting up libctf-nobfd0:amd64 (2.44-3) ...
Setting up krb5-locales (1.21.3-5) ...
Setting up libcom-err2:amd64 (1.47.2-3+b3) ...
Setting up sq (1.3.1-2+b1) ...
Setting up file (1:5.46-5) ...
Setting up libgomp1:amd64 (14.2.0-19) ...
Setting up bzip2 (1.0.8-6) ...
Setting up libldap-common (2.6.10+dfsg-1) ...
Setting up libsframe1:amd64 (2.44-3) ...
Setting up libfakeroot:amd64 (1.37.1.1-1) ...
Setting up libjansson4:amd64 (2.14-2+b3) ...
Setting up libkrb5support0:amd64 (1.21.3-5) ...
Setting up libsasl2-modules-db:amd64 (2.1.28+dfsg1-9) ...
Setting up fakeroot (1.37.1.1-1) ...
update-alternatives: using /usr/bin/fakeroot-sysv to provide /usr/bin/fakeroot (fakeroot) in auto mode
Setting up libpkgconf3:amd64 (1.8.1-4) ...
Setting up rpcsvc-proto (1.4.3-1) ...
Setting up make (4.4.1-2) ...
Setting up libmpfr6:amd64 (4.2.2-1) ...
Setting up bash-completion (1:2.16.0-7) ...
Setting up xz-utils (5.8.1-1) ...
update-alternatives: using /usr/bin/xz to provide /usr/bin/lzma (lzma) in auto mode
Setting up libquadmath0:amd64 (14.2.0-19) ...
Setting up libunistring5:amd64 (1.3-2) ...
Setting up libssl-dev:amd64 (3.5.1-1) ...
Setting up libmpc3:amd64 (1.3.1-1+b3) ...
Setting up libatomic1:amd64 (14.2.0-19) ...
Setting up patch (2.8-2) ...
Setting up pkgconf-bin (1.8.1-4) ...
Setting up libk5crypto3:amd64 (1.21.3-5) ...
Setting up libsasl2-2:amd64 (2.1.28+dfsg1-9) ...
Setting up libnghttp3-9:amd64 (1.8.0-1) ...
Setting up libubsan1:amd64 (14.2.0-19) ...
Setting up libffi8:amd64 (3.4.8-2) ...
Setting up perl-modules-5.40 (5.40.1-6) ...
Setting up libhwasan0:amd64 (14.2.0-19) ...
Setting up libcrypt-dev:amd64 (1:4.4.38-1) ...
Setting up libasan8:amd64 (14.2.0-19) ...
Setting up libtasn1-6:amd64 (4.20.0-2) ...
Setting up netbase (6.5) ...
Setting up libkrb5-3:amd64 (1.21.3-5) ...
Setting up libssh2-1t64:amd64 (1.11.1-1) ...
Setting up libtsan2:amd64 (14.2.0-19) ...
Setting up libbinutils:amd64 (2.44-3) ...
Setting up libisl23:amd64 (0.27-1) ...
Setting up libc-dev-bin (2.41-12) ...
Setting up openssl (3.5.1-1) ...
Setting up publicsuffix (20250328.1952-0.1) ...
Setting up libcc1-0:amd64 (14.2.0-19) ...
Setting up libldap2:amd64 (2.6.10+dfsg-1) ...
Setting up liblocale-gettext-perl (1.07-7+b1) ...
Setting up liblsan0:amd64 (14.2.0-19) ...
Setting up libitm1:amd64 (14.2.0-19) ...
Setting up libctf0:amd64 (2.44-3) ...
Setting up manpages-dev (6.9.1-1) ...
Setting up libidn2-0:amd64 (2.3.8-2) ...
Setting up pkgconf:amd64 (1.8.1-4) ...
Setting up libperl5.40:amd64 (5.40.1-6) ...
Setting up ca-certificates (20250419) ...
debconf: unable to initialize frontend: Dialog
debconf: (TERM is not set, so the dialog frontend is not usable.)
debconf: falling back to frontend: Readline
debconf: unable to initialize frontend: Readline
debconf: (This frontend requires a controlling tty.)
debconf: falling back to frontend: Teletype
debconf: unable to initialize frontend: Teletype
debconf: (This frontend requires a controlling tty.)
debconf: falling back to frontend: Noninteractive
Updating certificates in /etc/ssl/certs...
150 added, 0 removed; done.
Setting up perl (5.40.1-6) ...
Setting up libgprofng0:amd64 (2.44-3) ...
Setting up libp11-kit0:amd64 (0.25.5-3) ...
Setting up libgssapi-krb5-2:amd64 (1.21.3-5) ...
Setting up pkg-config:amd64 (1.8.1-4) ...
Setting up cpp-14-x86-64-linux-gnu (14.2.0-19) ...
Setting up libdpkg-perl (1.22.21) ...
Setting up cpp-14 (14.2.0-19) ...
Setting up libc6-dev:amd64 (2.41-12) ...
Setting up libgcc-14-dev:amd64 (14.2.0-19) ...
Setting up libstdc++-14-dev:amd64 (14.2.0-19) ...
Setting up binutils-x86-64-linux-gnu (2.44-3) ...
Setting up cpp-x86-64-linux-gnu (4:14.2.0-1) ...
Setting up libgnutls30t64:amd64 (3.8.9-3) ...
Setting up libfile-fcntllock-perl (0.22-4+b4) ...
Setting up libalgorithm-diff-perl (1.201-1) ...
Setting up libpsl5t64:amd64 (0.21.2-1.1+b1) ...
Setting up binutils (2.44-3) ...
Setting up dpkg-dev (1.22.21) ...
Setting up librtmp1:amd64 (2.4+20151223.gitfa8646d.1-2+b5) ...
Setting up cpp (4:14.2.0-1) ...
Setting up gcc-14-x86-64-linux-gnu (14.2.0-19) ...
Setting up libalgorithm-diff-xs-perl (0.04-9) ...
Setting up libalgorithm-merge-perl (0.08-5) ...
Setting up gcc-x86-64-linux-gnu (4:14.2.0-1) ...
Setting up libcurl4t64:amd64 (8.14.1-2) ...
Setting up gcc-14 (14.2.0-19) ...
Setting up g++-14-x86-64-linux-gnu (14.2.0-19) ...
Setting up g++-x86-64-linux-gnu (4:14.2.0-1) ...
Setting up curl (8.14.1-2) ...
Setting up g++-14 (14.2.0-19) ...
Setting up gcc (4:14.2.0-1) ...
Setting up g++ (4:14.2.0-1) ...
update-alternatives: using /usr/bin/g++ to provide /usr/bin/c++ (c++) in auto mode
Setting up build-essential (12.12) ...
Processing triggers for libc-bin (2.41-12) ...
Processing triggers for ca-certificates (20250419) ...
Updating certificates in /etc/ssl/certs...
0 added, 0 removed; done.
Running hooks in /etc/ca-certificates/update.d...
done.
Installing Rust...
info: downloading installer
info: profile set to 'default'
info: default host triple is x86_64-unknown-linux-gnu
info: syncing channel updates for 'stable-x86_64-unknown-linux-gnu'
info: latest update on 2025-08-07, rust version 1.89.0 (29483883e 2025-08-04)
info: downloading component 'cargo'
info: downloading component 'clippy'
info: downloading component 'rust-docs'
info: downloading component 'rust-std'
info: downloading component 'rustc'
info: downloading component 'rustfmt'
info: installing component 'cargo'
info: installing component 'clippy'
info: installing component 'rust-docs'
info: installing component 'rust-std'
info: installing component 'rustc'
info: installing component 'rustfmt'
info: default toolchain set to 'stable-x86_64-unknown-linux-gnu'
  stable-x86_64-unknown-linux-gnu installed - rustc 1.89.0 (29483883e 2025-08-04)
Rust is installed now. Great!
To get started you may need to restart your current shell.
This would reload your PATH environment variable to include
Cargo's bin directory ($HOME/.cargo/bin).
To configure your current shell, you need to source
the corresponding env file under $HOME/.cargo.
This is usually done by running one of the following (note the leading DOT):
. "$HOME/.cargo/env"            # For sh/bash/zsh/ash/dash/pdksh
source "$HOME/.cargo/env.fish"  # For fish
source $"($nu.home-path)/.cargo/env.nu"  # For nushell
rustc 1.89.0 (29483883e 2025-08-04)
cargo 1.89.0 (c24e10642 2025-06-23)
Building binary...
    Updating crates.io index
 Downloading crates ...
  Downloaded actix-macros v0.2.4
  Downloaded getrandom v0.3.3
  Downloaded base64 v0.22.1
  Downloaded home v0.5.11
  Downloaded untrusted v0.9.0
  Downloaded spin v0.9.8
  Downloaded num-conv v0.1.0
  Downloaded yoke-derive v0.8.0
  Downloaded zerofrom-derive v0.1.6
  Downloaded paste v1.0.15
  Downloaded pathdiff v0.2.3
  Downloaded num-traits v0.2.19
  Downloaded pin-utils v0.1.0
  Downloaded pkcs8 v0.10.2
  Downloaded pin-project-lite v0.2.16
  Downloaded parking_lot v0.12.4
  Downloaded num-bigint-dig v0.8.4
  Downloaded openssl-sys v0.9.109
  Downloaded mio v1.0.4
  Downloaded nom v7.1.3
  Downloaded regex-syntax v0.8.6
  Downloaded miniz_oxide v0.8.9
  Downloaded num-bigint v0.4.6
  Downloaded zerovec v0.11.4
  Downloaded zerotrie v0.2.2
  Downloaded webpki-roots v0.25.4
  Downloaded pest_meta v2.8.1
  Downloaded pest_derive v2.8.1
  Downloaded ordered-multimap v0.7.3
  Downloaded hyper v0.14.32
  Downloaded regex-automata v0.4.10
  Downloaded zerocopy v0.8.26
  Downloaded brotli v8.0.2
  Downloaded minimal-lexical v0.2.1
  Downloaded openssl v0.10.73
  Downloaded zstd-sys v2.0.15+zstd.1.5.7
  Downloaded libc v0.2.175
  Downloaded pest v2.8.1
  Downloaded memchr v2.7.5
  Downloaded pkcs1 v0.7.5
  Downloaded pin-project-internal v1.1.10
  Downloaded pin-project v1.1.10
  Downloaded pem-rfc7468 v0.7.0
  Downloaded pem v3.0.5
  Downloaded once_cell v1.21.3
  Downloaded nu-ansi-term v0.50.1
  Downloaded itoa v1.0.15
  Downloaded idna v1.1.0
  Downloaded reqwest v0.11.27
  Downloaded redis v0.24.0
  Downloaded pest_generator v2.8.1
  Downloaded percent-encoding v2.3.2
  Downloaded parking_lot_core v0.9.11
  Downloaded openssl-probe v0.1.6
  Downloaded num_cpus v1.17.0
  Downloaded num-iter v0.1.45
  Downloaded num-integer v0.1.46
  Downloaded native-tls v0.2.14
  Downloaded json5 v0.4.1
  Downloaded jobserver v0.1.34
  Downloaded icu_properties_data v2.0.1
  Downloaded yaml-rust2 v0.8.1
  Downloaded icu_locale_core v2.0.0
  Downloaded icu_collections v2.0.0
  Downloaded hyper-tls v0.5.0
  Downloaded hyper-rustls v0.24.2
  Downloaded encoding_rs v0.8.35
  Downloaded httparse v1.10.1
  Downloaded zstd v0.13.3
  Downloaded zerovec-derive v0.11.1
  Downloaded zeroize v1.8.1
  Downloaded winnow v0.7.13
  Downloaded regex v1.11.2
  Downloaded tokio v1.47.1
  Downloaded openssl-macros v0.1.1
  Downloaded indexmap v2.11.0
  Downloaded icu_provider v2.0.0
  Downloaded icu_properties v2.0.1
  Downloaded icu_normalizer_data v2.0.0
  Downloaded icu_normalizer v2.0.0
  Downloaded iana-time-zone v0.1.63
  Downloaded httpdate v1.0.3
  Downloaded http-body v0.4.6
  Downloaded libm v0.2.15
  Downloaded hkdf v0.12.4
  Downloaded vcpkg v0.2.15
  Downloaded syn v1.0.109
  Downloaded is_terminal_polyfill v1.70.1
  Downloaded ipnet v2.11.0
  Downloaded impl-more v0.1.9
  Downloaded idna_adapter v1.2.1
  Downloaded regex-lite v0.1.7
  Downloaded mime v0.3.17
  Downloaded url v2.5.7
  Downloaded unicode_categories v0.1.1
  Downloaded unicode-segmentation v1.12.0
  Downloaded unicode-normalization v0.1.24
  Downloaded ucd-trie v0.1.7
  Downloaded tracing-subscriber v0.3.20
  Downloaded tracing-log v0.2.0
  Downloaded tokio-util v0.7.16
  Downloaded sqlx-postgres v0.7.4
  Downloaded sqlx-core v0.7.4
  Downloaded brotli-decompressor v5.0.0
  Downloaded zerofrom v0.1.6
  Downloaded yoke v0.8.0
  Downloaded writeable v0.6.1
  Downloaded whoami v1.6.1
  Downloaded rand_core v0.9.3
  Downloaded md-5 v0.10.6
  Downloaded language-tags v0.3.2
  Downloaded jsonwebtoken v9.3.1
  Downloaded http v0.2.12
  Downloaded linux-raw-sys v0.9.4
  Downloaded hashbrown v0.15.5
  Downloaded version_check v0.9.5
  Downloaded uuid v1.18.1
  Downloaded utf8parse v0.2.2
  Downloaded unicode-ident v1.0.18
  Downloaded typenum v1.18.0
  Downloaded tungstenite v0.20.1
  Downloaded tracing-core v0.1.34
  Downloaded tracing-attributes v0.1.30
  Downloaded toml_edit v0.22.27
  Downloaded toml v0.8.23
  Downloaded tokio-rustls v0.24.1
  Downloaded tokio-macros v2.5.0
  Downloaded tinyvec v1.10.0
  Downloaded thiserror-impl v2.0.16
  Downloaded thiserror v1.0.69
  Downloaded tempfile v3.21.0
  Downloaded h2 v0.3.27
  Downloaded futures-util v0.3.31
  Downloaded clap_builder v4.5.47
  Downloaded matchers v0.2.0
  Downloaded log v0.4.28
  Downloaded lock_api v0.4.13
  Downloaded local-waker v0.1.4
  Downloaded local-channel v0.1.5
  Downloaded litemap v0.8.0
  Downloaded lazy_static v1.5.0
  Downloaded hmac v0.12.1
  Downloaded heck v0.5.0
  Downloaded hashlink v0.8.4
  Downloaded zstd-safe v7.2.4
  Downloaded rand v0.9.2
  Downloaded rand v0.8.5
  Downloaded proc-macro2 v1.0.101
  Downloaded powerfmt v0.2.0
  Downloaded potential_utf v0.1.3
  Downloaded utf8_iter v1.0.4
  Downloaded utf-8 v0.7.6
  Downloaded urlencoding v2.1.3
  Downloaded unicode-xid v0.2.6
  Downloaded unicode-properties v0.1.3
  Downloaded unicode-bidi v0.3.18
  Downloaded try-lock v0.2.5
  Downloaded tracing-serde v0.2.0
  Downloaded tracing v0.1.41
  Downloaded tower-service v0.3.3
  Downloaded toml_write v0.1.2
  Downloaded toml_datetime v0.6.11
  Downloaded tokio-tungstenite v0.20.1
  Downloaded tokio-stream v0.1.17
  Downloaded tokio-retry v0.3.0
  Downloaded tokio-native-tls v0.3.1
  Downloaded tinyvec_macros v0.1.1
  Downloaded tinystr v0.8.1
  Downloaded time-macros v0.2.24
  Downloaded time-core v0.1.6
  Downloaded time v0.3.43
  Downloaded thread_local v1.1.9
  Downloaded thiserror-impl v1.0.69
  Downloaded thiserror v2.0.16
  Downloaded sync_wrapper v0.1.2
  Downloaded syn v2.0.106
  Downloaded subtle v2.6.1
  Downloaded strsim v0.11.1
  Downloaded stringprep v0.1.5
  Downloaded stable_deref_trait v1.2.0
  Downloaded sqlx-sqlite v0.7.4
  Downloaded sqlx-mysql v0.7.4
  Downloaded sqlx-macros v0.7.4
  Downloaded futures-intrusive v0.5.0
  Downloaded futures v0.3.31
  Downloaded flume v0.11.1
  Downloaded flate2 v1.1.2
  Downloaded derive_more v2.0.1
  Downloaded deranged v0.5.3
  Downloaded combine v4.6.7
  Downloaded want v0.3.1
  Downloaded hex v0.4.3
  Downloaded heck v0.4.1
  Downloaded rand_core v0.6.4
  Downloaded rand_chacha v0.9.0
  Downloaded rand_chacha v0.3.1
  Downloaded quote v1.0.40
  Downloaded ppv-lite86 v0.2.21
  Downloaded pkg-config v0.3.32
  Downloaded synstructure v0.13.2
  Downloaded sqlx-macros-core v0.7.4
  Downloaded sqlx v0.7.4
  Downloaded sqlformat v0.2.6
  Downloaded sha1_smol v1.0.1
  Downloaded sha1 v0.10.6
  Downloaded serde_json v1.0.143
  Downloaded ring v0.17.14
  Downloaded getrandom v0.2.16
  Downloaded generic-array v0.14.7
  Downloaded futures-task v0.3.31
  Downloaded futures-sink v0.3.31
  Downloaded futures-macro v0.3.31
  Downloaded futures-io v0.3.31
  Downloaded futures-core v0.3.31
  Downloaded futures-channel v0.3.31
  Downloaded form_urlencoded v1.2.2
  Downloaded foldhash v0.1.5
  Downloaded fastrand v2.3.0
  Downloaded either v1.15.0
  Downloaded dotenvy v0.15.7
  Downloaded der v0.7.10
  Downloaded data-encoding v2.9.0
  Downloaded dashmap v5.5.3
  Downloaded crunchy v0.2.4
  Downloaded crossbeam-utils v0.8.21
  Downloaded crc16 v0.4.0
  Downloaded config v0.14.1
  Downloaded cc v1.2.35
  Downloaded socket2 v0.6.0
  Downloaded socket2 v0.5.10
  Downloaded signal-hook-registry v1.4.6
  Downloaded sharded-slab v0.1.7
  Downloaded sha2 v0.10.9
  Downloaded serde_derive v1.0.219
  Downloaded serde v1.0.219
  Downloaded ryu v1.0.20
  Downloaded rustls-webpki v0.101.7
  Downloaded rustls v0.21.12
  Downloaded rustix v1.0.8
  Downloaded rsa v0.9.8
  Downloaded ron v0.8.1
  Downloaded hashbrown v0.14.5
  Downloaded futures-executor v0.3.31
  Downloaded foreign-types-shared v0.1.1
  Downloaded foreign-types v0.3.2
  Downloaded fnv v1.0.7
  Downloaded equivalent v1.0.2
  Downloaded dlv-list v0.5.2
  Downloaded displaydoc v0.2.5
  Downloaded derive_more-impl v2.0.1
  Downloaded crypto-common v0.1.6
  Downloaded cpufeatures v0.2.17
  Downloaded convert_case v0.6.0
  Downloaded const-random-macro v0.1.16
  Downloaded clap_lex v0.7.5
  Downloaded spki v0.7.3
  Downloaded socket2 v0.4.10
  Downloaded smallvec v1.15.1
  Downloaded slab v0.4.11
  Downloaded signature v2.2.0
  Downloaded shlex v1.3.0
  Downloaded serde_urlencoded v0.7.1
  Downloaded serde_spanned v0.6.9
  Downloaded sct v0.7.1
  Downloaded scopeguard v1.2.0
  Downloaded rust-ini v0.20.0
  Downloaded event-listener v2.5.3
  Downloaded errno v0.3.13
  Downloaded digest v0.10.7
  Downloaded crossbeam-queue v0.3.12
  Downloaded crc32fast v1.5.0
  Downloaded crc-catalog v2.4.0
  Downloaded libsqlite3-sys v0.27.0
  Downloaded crc v3.3.0
  Downloaded const-random v0.1.18
  Downloaded colorchoice v1.0.4
  Downloaded clap_derive v4.5.47
  Downloaded clap v4.5.47
  Downloaded chrono v0.4.41
  Downloaded cfg-if v1.0.3
  Downloaded bytestring v1.4.0
  Downloaded bytes v1.10.1
  Downloaded block-buffer v0.10.4
  Downloaded bitflags v2.9.4
  Downloaded base64ct v1.8.0
  Downloaded tiny-keccak v2.0.2
  Downloaded simple_asn1 v0.6.3
  Downloaded rustls-pemfile v1.0.4
  Downloaded cookie v0.16.2
  Downloaded const-oid v0.9.6
  Downloaded byteorder v1.5.0
  Downloaded base64 v0.21.7
  Downloaded async-trait v0.1.89
  Downloaded arc-swap v1.7.1
  Downloaded anstyle-parse v0.2.7
  Downloaded allocator-api2 v0.2.21
  Downloaded aho-corasick v1.1.3
  Downloaded actix-web v4.11.0
  Downloaded actix-service v2.0.3
  Downloaded actix-server v2.6.0
  Downloaded actix-http v3.11.1
  Downloaded atoi v2.0.0
  Downloaded anyhow v1.0.99
  Downloaded anstream v0.6.20
  Downloaded ahash v0.8.12
  Downloaded adler2 v2.0.1
  Downloaded actix-web-httpauth v0.8.2
  Downloaded actix-web-codegen v4.3.0
  Downloaded actix-utils v3.0.1
  Downloaded actix-rt v2.11.0
  Downloaded actix-cors v0.7.1
  Downloaded find-msvc-tools v0.1.0
  Downloaded autocfg v1.5.0
  Downloaded arraydeque v0.5.1
  Downloaded anstyle-query v1.1.4
  Downloaded anstyle v1.0.11
  Downloaded alloc-stdlib v0.2.2
  Downloaded alloc-no-stdlib v2.0.4
  Downloaded actix-router v0.5.3
  Downloaded actix-codec v0.5.2
   Compiling proc-macro2 v1.0.101
   Compiling unicode-ident v1.0.18
   Compiling libc v0.2.175
   Compiling cfg-if v1.0.3
   Compiling autocfg v1.5.0
   Compiling version_check v0.9.5
   Compiling find-msvc-tools v0.1.0
   Compiling shlex v1.3.0
   Compiling serde v1.0.219
   Compiling quote v1.0.40
   Compiling syn v2.0.106
   Compiling zerocopy v0.8.26
   Compiling jobserver v0.1.34
   Compiling lock_api v0.4.13
   Compiling cc v1.2.35
   Compiling parking_lot_core v0.9.11
   Compiling typenum v1.18.0
   Compiling smallvec v1.15.1
   Compiling memchr v2.7.5
   Compiling pin-project-lite v0.2.16
   Compiling generic-array v0.14.7
   Compiling log v0.4.28
   Compiling once_cell v1.21.3
   Compiling bytes v1.10.1
   Compiling scopeguard v1.2.0
   Compiling futures-core v0.3.31
   Compiling icu_properties_data v2.0.1
   Compiling icu_normalizer_data v2.0.0
   Compiling parking_lot v0.12.4
   Compiling mio v1.0.4
   Compiling socket2 v0.6.0
   Compiling signal-hook-registry v1.4.6
   Compiling itoa v1.0.15
   Compiling futures-sink v0.3.31
   Compiling stable_deref_trait v1.2.0
   Compiling getrandom v0.3.3
   Compiling ahash v0.8.12
   Compiling pkg-config v0.3.32
   Compiling synstructure v0.13.2
   Compiling tracing-core v0.1.34
   Compiling futures-channel v0.3.31
   Compiling getrandom v0.2.16
   Compiling slab v0.4.11
   Compiling serde_json v1.0.143
   Compiling futures-io v0.3.31
   Compiling pin-utils v0.1.0
   Compiling futures-task v0.3.31
   Compiling writeable v0.6.1
   Compiling litemap v0.8.0
   Compiling hashbrown v0.15.5
   Compiling equivalent v1.0.2
   Compiling ring v0.17.14
   Compiling serde_derive v1.0.219
   Compiling zerofrom-derive v0.1.6
   Compiling yoke-derive v0.8.0
   Compiling zerovec-derive v0.11.1
   Compiling displaydoc v0.2.5
   Compiling tracing-attributes v0.1.30
   Compiling tokio-macros v2.5.0
   Compiling zerofrom v0.1.6
   Compiling yoke v0.8.0
   Compiling tokio v1.47.1
   Compiling zerovec v0.11.4
   Compiling futures-macro v0.3.31
   Compiling tinystr v0.8.1
   Compiling icu_locale_core v2.0.0
   Compiling futures-util v0.3.31
   Compiling potential_utf v0.1.3
   Compiling tracing v0.1.41
   Compiling zerotrie v0.2.2
   Compiling icu_provider v2.0.0
   Compiling icu_collections v2.0.0
   Compiling indexmap v2.11.0
   Compiling crypto-common v0.1.6
   Compiling block-buffer v0.10.4
   Compiling percent-encoding v2.3.2
   Compiling subtle v2.6.1
   Compiling digest v0.10.7
   Compiling bitflags v2.9.4
   Compiling ppv-lite86 v0.2.21
   Compiling fnv v1.0.7
   Compiling http v0.2.12
   Compiling icu_normalizer v2.0.0
   Compiling icu_properties v2.0.1
   Compiling crossbeam-utils v0.8.21
   Compiling thiserror v2.0.16
   Compiling ryu v1.0.20
   Compiling untrusted v0.9.0
   Compiling thiserror v1.0.69
   Compiling idna_adapter v1.2.1
   Compiling form_urlencoded v1.2.2
   Compiling tokio-util v0.7.16
   Compiling utf8_iter v1.0.4
   Compiling httparse v1.10.1
   Compiling idna v1.1.0
   Compiling thiserror-impl v2.0.16
   Compiling thiserror-impl v1.0.69
   Compiling num-traits v0.2.19
   Compiling cpufeatures v0.2.17
   Compiling url v2.5.7
   Compiling vcpkg v0.2.15
   Compiling rustls v0.21.12
   Compiling allocator-api2 v0.2.21
   Compiling hashbrown v0.14.5
   Compiling openssl-sys v0.9.109
   Compiling zstd-sys v2.0.15+zstd.1.5.7
   Compiling paste v1.0.15
   Compiling crunchy v0.2.4
   Compiling h2 v0.3.27
   Compiling rand_core v0.6.4
   Compiling rustls-webpki v0.101.7
   Compiling sct v0.7.1
   Compiling aho-corasick v1.1.3
   Compiling socket2 v0.5.10
   Compiling num-conv v0.1.0
   Compiling regex-syntax v0.8.6
   Compiling time-core v0.1.6
   Compiling tiny-keccak v2.0.2
   Compiling powerfmt v0.2.0
   Compiling httpdate v1.0.3
   Compiling deranged v0.5.3
   Compiling regex-automata v0.4.10
   Compiling time-macros v0.2.24
   Compiling rand_chacha v0.3.1
   Compiling encoding_rs v0.8.35
   Compiling zstd-safe v7.2.4
   Compiling local-waker v0.1.4
   Compiling minimal-lexical v0.2.1
   Compiling tinyvec_macros v0.1.1
   Compiling alloc-no-stdlib v2.0.4
   Compiling base64 v0.21.7
   Compiling crc32fast v1.5.0
   Compiling alloc-stdlib v0.2.2
   Compiling time v0.3.43
   Compiling tinyvec v1.10.0
   Compiling nom v7.1.3
   Compiling rand v0.8.5
   Compiling sha1 v0.10.6
   Compiling actix-macros v0.2.4
   Compiling unicode-xid v0.2.6
   Compiling openssl v0.10.73
   Compiling foreign-types-shared v0.1.1
   Compiling crc-catalog v2.4.0
   Compiling base64 v0.22.1
   Compiling adler2 v2.0.1
   Compiling ucd-trie v0.1.7
   Compiling unicode_categories v0.1.1
   Compiling sqlformat v0.2.6
   Compiling pest v2.8.1
   Compiling rustls-pemfile v1.0.4
   Compiling miniz_oxide v0.8.9
   Compiling sha2 v0.10.9
   Compiling crc v3.3.0
   Compiling foreign-types v0.3.2
   Compiling tokio-stream v0.1.17
   Compiling derive_more-impl v2.0.1
   Compiling actix-rt v2.11.0
   Compiling chrono v0.4.41
   Compiling rand_chacha v0.9.0
   Compiling futures-intrusive v0.5.0
   Compiling const-random-macro v0.1.16
   Compiling crossbeam-queue v0.3.12
   Compiling hashlink v0.8.4
   Compiling unicode-normalization v0.1.24
   Compiling brotli-decompressor v5.0.0
   Compiling actix-utils v3.0.1
   Compiling atoi v2.0.0
   Compiling hmac v0.12.1
   Compiling either v1.15.0
   Compiling bytestring v1.4.0
   Compiling openssl-macros v0.1.1
   Compiling actix-service v2.0.3
   Compiling cookie v0.16.2
   Compiling webpki-roots v0.25.4
   Compiling mime v0.3.17
   Compiling linux-raw-sys v0.9.4
   Compiling try-lock v0.2.5
   Compiling unicode-bidi v0.3.18
   Compiling hex v0.4.3
   Compiling native-tls v0.2.14
   Compiling byteorder v1.5.0
   Compiling uuid v1.18.1
   Compiling event-listener v2.5.3
   Compiling regex-lite v0.1.7
   Compiling syn v1.0.109
   Compiling unicode-properties v0.1.3
   Compiling stringprep v0.1.5
   Compiling actix-router v0.5.3
   Compiling sqlx-core v0.7.4
   Compiling want v0.3.1
   Compiling hkdf v0.12.4
   Compiling brotli v8.0.2
   Compiling flate2 v1.1.2
   Compiling const-random v0.1.18
   Compiling derive_more v2.0.1
   Compiling rand v0.9.2
   Compiling pest_meta v2.8.1
   Compiling local-channel v0.1.5
   Compiling regex v1.11.2
   Compiling md-5 v0.10.6
   Compiling actix-codec v0.5.2
   Compiling serde_urlencoded v0.7.1
   Compiling http-body v0.4.6
   Compiling whoami v1.6.1
   Compiling tower-service v0.3.3
   Compiling dotenvy v0.15.7
   Compiling home v0.5.11
   Compiling openssl-probe v0.1.6
   Compiling fastrand v2.3.0
   Compiling foldhash v0.1.5
   Compiling utf8parse v0.2.2
   Compiling unicode-segmentation v1.12.0
   Compiling language-tags v0.3.2
   Compiling heck v0.4.1
   Compiling anstyle-parse v0.2.7
   Compiling tempfile v3.21.0
   Compiling sqlx-postgres v0.7.4
   Compiling hyper v0.14.32
   Compiling pest_generator v2.8.1
   Compiling dlv-list v0.5.2
   Compiling actix-web-codegen v4.3.0
   Compiling actix-server v2.6.0
   Compiling tokio-rustls v0.24.1
   Compiling num-integer v0.1.46
   Compiling toml_datetime v0.6.11
   Compiling serde_spanned v0.6.9
   Compiling pin-project-internal v1.1.10
   Compiling is_terminal_polyfill v1.70.1
   Compiling anstyle-query v1.1.4
   Compiling colorchoice v1.0.4
   Compiling impl-more v0.1.9
   Compiling crc16 v0.4.0
   Compiling toml_write v0.1.2
   Compiling winnow v0.7.13
   Compiling anstyle v1.0.11
   Compiling toml_edit v0.22.27
   Compiling anstream v0.6.20
   Compiling pin-project v1.1.10
   Compiling sqlx-macros-core v0.7.4
   Compiling num-bigint v0.4.6
   Compiling pest_derive v2.8.1
   Compiling zstd v0.13.3
   Compiling ordered-multimap v0.7.3
   Compiling actix-http v3.11.1
   Compiling tokio-native-tls v0.3.1
   Compiling futures-executor v0.3.31
   Compiling async-trait v0.1.89
   Compiling heck v0.5.0
   Compiling clap_lex v0.7.5
   Compiling utf-8 v0.7.6
   Compiling lazy_static v1.5.0
   Compiling arraydeque v0.5.1
   Compiling anyhow v1.0.99
   Compiling data-encoding v2.9.0
   Compiling strsim v0.11.1
   Compiling clap_builder v4.5.47
   Compiling actix-web v4.11.0
   Compiling tungstenite v0.20.1
   Compiling convert_case v0.6.0
   Compiling yaml-rust2 v0.8.1
   Compiling sharded-slab v0.1.7
   Compiling clap_derive v4.5.47
   Compiling futures v0.3.31
   Compiling hyper-tls v0.5.0
   Compiling rust-ini v0.20.0
   Compiling json5 v0.4.1
   Compiling sqlx-macros v0.7.4
   Compiling simple_asn1 v0.6.3
   Compiling toml v0.8.23
   Compiling tokio-retry v0.3.0
   Compiling hyper-rustls v0.24.2
   Compiling pem v3.0.5
   Compiling ron v0.8.1
   Compiling matchers v0.2.0
   Compiling combine v4.6.7
   Compiling tracing-serde v0.2.0
   Compiling tracing-log v0.2.0
   Compiling socket2 v0.4.10
   Compiling thread_local v1.1.9
   Compiling ipnet v2.11.0
   Compiling pathdiff v0.2.3
   Compiling sync_wrapper v0.1.2
   Compiling arc-swap v1.7.1
   Compiling sha1_smol v1.0.1
   Compiling nu-ansi-term v0.50.1
   Compiling reqwest v0.11.27
   Compiling tracing-subscriber v0.3.20
   Compiling config v0.14.1
   Compiling redis v0.24.0
   Compiling sqlx v0.7.4
   Compiling jsonwebtoken v9.3.1
   Compiling clap v4.5.47
   Compiling tokio-tungstenite v0.20.1
   Compiling actix-cors v0.7.1
   Compiling actix-web-httpauth v0.8.2
   Compiling dashmap v5.5.3
   Compiling num_cpus v1.17.0
   Compiling viworks-backend-agent v0.1.0 (/root)
warning: unused import: `actix_cors::Cors`
 --> src/main.rs:1:5
  |
1 | use actix_cors::Cors;
  |     ^^^^^^^^^^^^^^^^
  |
  = note: `#[warn(unused_imports)]` on by default
warning: unused import: `crate::command::CommandEngine`
 --> src/agent/manager.rs:3:5
  |
3 | use crate::command::CommandEngine;
  |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
warning: unused import: `crate::telemetry::TelemetryProcessor`
 --> src/agent/manager.rs:8:5
  |
8 | use crate::telemetry::TelemetryProcessor;
  |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
warning: unused imports: `App`, `HttpServer`, `middleware::Logger`, and `web`
 --> src/agent/manager.rs:9:17
  |
9 | use actix_web::{middleware::Logger, web, App, HttpServer};
  |                 ^^^^^^^^^^^^^^^^^^  ^^^  ^^^  ^^^^^^^^^^
warning: unused import: `std::net::SocketAddr`
  --> src/agent/manager.rs:11:5
   |
11 | use std::net::SocketAddr;
   |     ^^^^^^^^^^^^^^^^^^^^
warning: unused import: `tokio_tungstenite::tungstenite::handshake::server::Callback`
  --> src/agent/manager.rs:16:5
   |
16 | use tokio_tungstenite::tungstenite::handshake::server::Callback;
   |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
warning: unused import: `WebSocketStream`
  --> src/agent/manager.rs:17:39
   |
17 | use tokio_tungstenite::{accept_async, WebSocketStream};
   |                                       ^^^^^^^^^^^^^^^
warning: unused import: `tokio::sync::RwLock`
 --> src/agent/registry.rs:5:5
  |
5 | use tokio::sync::RwLock;
  |     ^^^^^^^^^^^^^^^^^^^
warning: unused import: `error`
 --> src/agent/registry.rs:6:22
  |
6 | use tracing::{debug, error, info, warn};
  |                      ^^^^^
warning: unused import: `uuid::Uuid`
 --> src/agent/registry.rs:7:5
  |
7 | use uuid::Uuid;
  |     ^^^^^^^^^^
warning: unused import: `info`
 --> src/api/auth.rs:9:29
  |
9 | use tracing::{debug, error, info, warn};
  |                             ^^^^
warning: unused import: `warn`
  --> src/api/handlers.rs:11:35
   |
11 | use tracing::{debug, error, info, warn};
   |                                   ^^^^
warning: unused import: `auth::*`
 --> src/api/mod.rs:5:9
  |
5 | pub use auth::*;
  |         ^^^^^^^
warning: unused import: `handlers::*`
 --> src/api/mod.rs:6:9
  |
6 | pub use handlers::*;
  |         ^^^^^^^^^^^
warning: unused import: `routes::configure_routes`
 --> src/api/mod.rs:7:9
  |
7 | pub use routes::configure_routes;
  |         ^^^^^^^^^^^^^^^^^^^^^^^^
warning: unused imports: `CommandPriority` and `CommandStatus`
 --> src/command/executor.rs:1:27
  |
1 | use crate::data::models::{CommandPriority, CommandRecord, CommandResult, CommandStatus};
  |                           ^^^^^^^^^^^^^^^                                ^^^^^^^^^^^^^
warning: unused import: `serde_json::Value`
 --> src/command/executor.rs:3:5
  |
3 | use serde_json::Value;
  |     ^^^^^^^^^^^^^^^^^
warning: unused import: `std::collections::HashMap`
 --> src/command/executor.rs:4:5
  |
4 | use std::collections::HashMap;
  |     ^^^^^^^^^^^^^^^^^^^^^^^^^
warning: unused imports: `debug` and `error`
 --> src/command/executor.rs:5:15
  |
5 | use tracing::{debug, error, info, warn};
  |               ^^^^^  ^^^^^
warning: unused import: `error`
 --> src/command/queue.rs:7:22
  |
7 | use tracing::{debug, error, info, warn};
  |                      ^^^^^
warning: unused import: `uuid::Uuid`
 --> src/command/queue.rs:8:5
  |
8 | use uuid::Uuid;
  |     ^^^^^^^^^^
warning: unused import: `models::*`
 --> src/data/mod.rs:5:9
  |
5 | pub use models::*;
  |         ^^^^^^^^^
warning: unused import: `std::fmt`
 --> src/error.rs:3:5
  |
3 | use std::fmt;
  |     ^^^^^^^^
warning: unused import: `std::collections::HashMap`
 --> src/telemetry/analytics.rs:4:5
  |
4 | use std::collections::HashMap;
  |     ^^^^^^^^^^^^^^^^^^^^^^^^^
warning: unused import: `std::sync::Arc`
 --> src/telemetry/analytics.rs:5:5
  |
5 | use std::sync::Arc;
  |     ^^^^^^^^^^^^^^
warning: unused import: `error`
 --> src/telemetry/analytics.rs:6:22
  |
6 | use tracing::{debug, error, info, warn};
  |                      ^^^^^
warning: unused import: `AgentInfo`
 --> src/telemetry/processor.rs:2:27
  |
2 | use crate::data::models::{AgentInfo, NetworkStats, TelemetryMessage, TelemetryRecord};
  |                           ^^^^^^^^^
warning: unused imports: `debug` and `warn`
 --> src/telemetry/processor.rs:9:15
  |
9 | use tracing::{debug, error, info, warn};
  |               ^^^^^               ^^^^
warning: unused import: `std::sync::Arc`
 --> src/telemetry/storage.rs:4:5
  |
4 | use std::sync::Arc;
  |     ^^^^^^^^^^^^^^
warning: unused variable: `registry`
   --> src/agent/manager.rs:145:9
    |
145 |         registry: Arc<AgentRegistry>,
    |         ^^^^^^^^ help: if this is intentional, prefix it with an underscore: `_registry`
    |
    = note: `#[warn(unused_variables)]` on by default
warning: unused variable: `config`
   --> src/agent/manager.rs:149:9
    |
149 |         config: Config,
    |         ^^^^^^ help: if this is intentional, prefix it with an underscore: `_config`
warning: variable does not need to be mutable
   --> src/agent/manager.rs:160:13
    |
160 |         let mut connection = AgentConnection::new(ws_stream);
    |             ----^^^^^^^^^^
    |             |
    |             help: remove this `mut`
    |
    = note: `#[warn(unused_mut)]` on by default
warning: unused variable: `agent_info`
   --> src/agent/manager.rs:190:13
    |
190 |         let agent_info =
    |             ^^^^^^^^^^ help: if this is intentional, prefix it with an underscore: `_agent_info`
warning: unused variable: `config`
   --> src/agent/manager.rs:436:17
    |
436 |             let config = config.clone();
    |                 ^^^^^^ help: if this is intentional, prefix it with an underscore: `_config`
warning: variable does not need to be mutable
   --> src/api/auth.rs:103:17
    |
103 |             let mut req = req;
    |                 ----^^^
    |                 |
    |                 help: remove this `mut`
warning: unused variable: `ws_message`
   --> src/command/engine.rs:136:13
    |
136 |         let ws_message = WebSocketMessage {
    |             ^^^^^^^^^^ help: if this is intentional, prefix it with an underscore: `_ws_message`
warning: unused variable: `config`
   --> src/command/engine.rs:404:13
    |
404 |         let config = self.config.clone();
    |             ^^^^^^ help: if this is intentional, prefix it with an underscore: `_config`
warning: unused variable: `command`
   --> src/command/engine.rs:435:21
    |
435 |         if let Some(command) = self.active_commands.remove(correlation_id) {
    |                     ^^^^^^^ help: if this is intentional, prefix it with an underscore: `_command`
warning: unused variable: `disk_usage`
   --> src/telemetry/analytics.rs:176:21
    |
176 |                 let disk_usage = telemetry
    |                     ^^^^^^^^^^ help: if this is intentional, prefix it with an underscore: `_disk_usage`
warning: unused variable: `data_layer_for_server`
   --> src/main.rs:126:9
    |
126 |     let data_layer_for_server = data_layer.clone();
    |         ^^^^^^^^^^^^^^^^^^^^^ help: if this is intentional, prefix it with an underscore: `_data_layer_for_server`
warning: fields `sender` and `is_authenticated` are never read
  --> src/agent/connection.rs:23:9
   |
16 | pub struct AgentConnection<S>
   |            --------------- fields in this struct
...
23 |     pub sender: mpsc::UnboundedSender<WebSocketMessage>,
   |         ^^^^^^
...
26 |     pub is_authenticated: Arc<RwLock<bool>>,
   |         ^^^^^^^^^^^^^^^^
   |
   = note: `AgentConnection` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis
   = note: `#[warn(dead_code)]` on by default
warning: multiple methods are never used
   --> src/agent/connection.rs:140:14
    |
29  | / impl<S> AgentConnection<S>
30  | | where
31  | |     S: tokio::io::AsyncRead + tokio::io::AsyncWrite + Unpin + std::marker::Send,
    | |________________________________________________________________________________- methods in this implementation
...
140 |       async fn handle_text_message(&mut self, text: &str) -> BackendAgentResult<()> {
    |                ^^^^^^^^^^^^^^^^^^^
...
184 |       async fn handle_binary_message(&mut self, data: &[u8]) -> BackendAgentResult<()> {
    |                ^^^^^^^^^^^^^^^^^^^^^
...
202 |       async fn handle_hello_message(&mut self, hello_msg: HelloMessage) -> BackendAgentResult<()> {
    |                ^^^^^^^^^^^^^^^^^^^^
...
276 |       async fn handle_telemetry_message(
    |                ^^^^^^^^^^^^^^^^^^^^^^^^
...
304 |       async fn handle_result_message(&mut self, result_msg: ResultMessage) -> BackendAgentResult<()> {
    |                ^^^^^^^^^^^^^^^^^^^^^
...
329 |       async fn handle_heartbeat_message(
    |                ^^^^^^^^^^^^^^^^^^^^^^^^
...
351 |       pub async fn send_message(&self, message: WebSocketMessage) -> BackendAgentResult<()> {
    |                    ^^^^^^^^^^^^
...
368 |       pub async fn is_authenticated(&self) -> bool {
    |                    ^^^^^^^^^^^^^^^^
...
373 |       pub async fn get_last_heartbeat(&self) -> chrono::DateTime<chrono::Utc> {
    |                    ^^^^^^^^^^^^^^^^^^
...
385 |       pub async fn close(&mut self) -> BackendAgentResult<()> {
    |                    ^^^^^
warning: multiple methods are never used
   --> src/agent/manager.rs:81:18
    |
29  | impl AgentManager {
    | ----------------- methods in this implementation
...
81  |     pub async fn stop(&mut self) -> BackendAgentResult<()> {
    |                  ^^^^
...
184 |     pub async fn send_command_to_agent(
    |                  ^^^^^^^^^^^^^^^^^^^^^
...
241 |     pub async fn send_command_to_agents(
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
276 |     pub async fn send_command_to_all_agents(
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
287 |     pub async fn send_command_to_site(
    |                  ^^^^^^^^^^^^^^^^^^^^
...
299 |     pub async fn send_command_to_capability(
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
311 |     pub async fn get_agent(&self, agent_id: &str) -> Option<AgentInfo> {
    |                  ^^^^^^^^^
...
316 |     pub async fn list_agents(&self) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^
...
321 |     pub async fn get_agents_by_status(&self, status: &AgentStatus) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^
...
326 |     pub async fn get_agents_by_site(&self, site: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^
...
331 |     pub async fn get_agents_with_capability(&self, capability: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
336 |     pub async fn update_agent_status(
    |                  ^^^^^^^^^^^^^^^^^^^
...
345 |     pub async fn get_statistics(&self) -> crate::agent::registry::AgentStatistics {
    |                  ^^^^^^^^^^^^^^
...
350 |     pub async fn is_agent_online(&self, agent_id: &str) -> bool {
    |                  ^^^^^^^^^^^^^^^
...
355 |     pub async fn total_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^
...
360 |     pub async fn online_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^^
...
365 |     pub async fn offline_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^^^
...
370 |     pub async fn close_connection(&self, connection_id: &str) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^
...
385 |     async fn close_all_connections(&self) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^
warning: multiple methods are never used
   --> src/agent/registry.rs:26:18
    |
16  | impl AgentRegistry {
    | ------------------ methods in this implementation
...
26  |     pub async fn register_agent(
    |                  ^^^^^^^^^^^^^^
...
52  |     pub async fn unregister_agent(
    |                  ^^^^^^^^^^^^^^^^
...
81  |     pub async fn get_agent(&self, agent_id: &str) -> Option<AgentInfo> {
    |                  ^^^^^^^^^
...
86  |     pub async fn get_agent_by_connection(&self, connection_id: &str) -> Option<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^^
...
97  |     pub async fn list_agents(&self) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^
...
102 |     pub async fn get_agents_by_site(&self, site: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^
...
111 |     pub async fn get_agents_by_status(&self, status: &AgentStatus) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^
...
137 |     pub async fn update_agent_last_seen(&self, agent_id: &str) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
150 |     pub async fn is_agent_online(&self, agent_id: &str) -> bool {
    |                  ^^^^^^^^^^^^^^^
...
159 |     pub async fn get_connection_id(&self, agent_id: &str) -> Option<String> {
    |                  ^^^^^^^^^^^^^^^^^
...
166 |     pub async fn total_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^
...
171 |     pub async fn online_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^^
...
179 |     pub async fn offline_agents(&self) -> usize {
    |                  ^^^^^^^^^^^^^^
...
187 |     pub async fn get_agents_with_capability(&self, capability: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
196 |     pub async fn get_agents_by_os(&self, os: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^
...
205 |     pub async fn get_agents_by_container_engine(&self, engine: &str) -> Vec<AgentInfo> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
240 |     pub async fn get_statistics(&self) -> AgentStatistics {
    |                  ^^^^^^^^^^^^^^
...
263 |     async fn get_os_distribution(&self) -> std::collections::HashMap<String, usize> {
    |              ^^^^^^^^^^^^^^^^^^^
...
273 |     async fn get_site_distribution(&self) -> std::collections::HashMap<String, usize> {
    |              ^^^^^^^^^^^^^^^^^^^^^
...
283 |     async fn get_capability_distribution(&self) -> std::collections::HashMap<String, usize> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^
warning: struct `AgentStatistics` is never constructed
   --> src/agent/registry.rs:297:12
    |
297 | pub struct AgentStatistics {
    |            ^^^^^^^^^^^^^^^
warning: associated function `new` is never used
  --> src/api/auth.rs:20:12
   |
19 | impl Claims {
   | ----------- associated function in this implementation
20 |     pub fn new(user_id: String, role: String, expires_in: Duration) -> Self {
   |            ^^^
warning: struct `AuthService` is never constructed
  --> src/api/auth.rs:35:12
   |
35 | pub struct AuthService {
   |            ^^^^^^^^^^^
warning: associated items `new`, `generate_token`, `validate_token`, and `check_role` are never used
  --> src/api/auth.rs:42:12
   |
41 | impl AuthService {
   | ---------------- associated items in this implementation
42 |     pub fn new(secret: &str) -> Self {
   |            ^^^
...
56 |     pub fn generate_token(&self, claims: Claims) -> BackendAgentResult<String> {
   |            ^^^^^^^^^^^^^^
...
65 |     pub fn validate_token(&self, token: &str) -> BackendAgentResult<Claims> {
   |            ^^^^^^^^^^^^^^
...
74 |     pub fn check_role(&self, claims: &Claims, required_role: &str) -> bool {
   |            ^^^^^^^^^^
warning: function `jwt_validator` is never used
  --> src/api/auth.rs:80:14
   |
80 | pub async fn jwt_validator(
   |              ^^^^^^^^^^^^^
warning: function `get_claims` is never used
   --> src/api/auth.rs:118:8
    |
118 | pub fn get_claims(req: &actix_web::HttpRequest) -> Option<Claims> {
    |        ^^^^^^^^^^
warning: function `require_admin_role` is never used
   --> src/api/auth.rs:123:8
    |
123 | pub fn require_admin_role(claims: &Claims) -> BackendAgentResult<()> {
    |        ^^^^^^^^^^^^^^^^^^
warning: function `require_operator_role` is never used
   --> src/api/auth.rs:133:8
    |
133 | pub fn require_operator_role(claims: &Claims) -> BackendAgentResult<()> {
    |        ^^^^^^^^^^^^^^^^^^^^^
warning: function `require_viewer_role` is never used
   --> src/api/auth.rs:143:8
    |
143 | pub fn require_viewer_role(claims: &Claims) -> BackendAgentResult<()> {
    |        ^^^^^^^^^^^^^^^^^^^
warning: fields `verb`, `args`, `agent_targets`, `timeout`, and `max_retries` are never read
  --> src/api/handlers.rs:17:9
   |
16 | pub struct CreateCommandRequest {
   |            -------------------- fields in this struct
17 |     pub verb: String,
   |         ^^^^
18 |     pub args: serde_json::Value,
   |         ^^^^
19 |     pub agent_targets: Vec<String>,
   |         ^^^^^^^^^^^^^
20 |     pub timeout: Option<u64>,
   |         ^^^^^^^
21 |     pub max_retries: Option<u32>,
   |         ^^^^^^^^^^^
   |
   = note: `CreateCommandRequest` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis
warning: struct `CreateCommandResponse` is never constructed
  --> src/api/handlers.rs:25:12
   |
25 | pub struct CreateCommandResponse {
   |            ^^^^^^^^^^^^^^^^^^^^^
warning: struct `AgentListResponse` is never constructed
  --> src/api/handlers.rs:31:12
   |
31 | pub struct AgentListResponse {
   |            ^^^^^^^^^^^^^^^^^
warning: struct `CommandListResponse` is never constructed
  --> src/api/handlers.rs:37:12
   |
37 | pub struct CommandListResponse {
   |            ^^^^^^^^^^^^^^^^^^^
warning: struct `StatisticsResponse` is never constructed
  --> src/api/handlers.rs:43:12
   |
43 | pub struct StatisticsResponse {
   |            ^^^^^^^^^^^^^^^^^^
warning: struct `HealthResponse` is never constructed
  --> src/api/handlers.rs:50:12
   |
50 | pub struct HealthResponse {
   |            ^^^^^^^^^^^^^^
warning: function `list_agents` is never used
  --> src/api/handlers.rs:58:14
   |
58 | pub async fn list_agents(
   |              ^^^^^^^^^^^
warning: function `get_agent` is never used
  --> src/api/handlers.rs:81:14
   |
81 | pub async fn get_agent(
   |              ^^^^^^^^^
warning: function `get_agents_by_site` is never used
   --> src/api/handlers.rs:104:14
    |
104 | pub async fn get_agents_by_site(
    |              ^^^^^^^^^^^^^^^^^^
warning: function `create_command` is never used
   --> src/api/handlers.rs:129:14
    |
129 | pub async fn create_command(
    |              ^^^^^^^^^^^^^^
warning: function `get_command` is never used
   --> src/api/handlers.rs:187:14
    |
187 | pub async fn get_command(
    |              ^^^^^^^^^^^
warning: function `list_commands` is never used
   --> src/api/handlers.rs:213:14
    |
213 | pub async fn list_commands(
    |              ^^^^^^^^^^^^^
warning: function `retry_command` is never used
   --> src/api/handlers.rs:253:14
    |
253 | pub async fn retry_command(
    |              ^^^^^^^^^^^^^
warning: function `cancel_command` is never used
   --> src/api/handlers.rs:284:14
    |
284 | pub async fn cancel_command(
    |              ^^^^^^^^^^^^^^
warning: function `get_agent_telemetry` is never used
   --> src/api/handlers.rs:316:14
    |
316 | pub async fn get_agent_telemetry(
    |              ^^^^^^^^^^^^^^^^^^^
warning: function `get_agent_telemetry_history` is never used
   --> src/api/handlers.rs:348:14
    |
348 | pub async fn get_agent_telemetry_history(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^
warning: function `get_statistics` is never used
   --> src/api/handlers.rs:385:14
    |
385 | pub async fn get_statistics(
    |              ^^^^^^^^^^^^^^
warning: function `health_check` is never used
   --> src/api/handlers.rs:413:14
    |
413 | pub async fn health_check() -> Result<HttpResponse> {
    |              ^^^^^^^^^^^^
warning: function `update_agent_status` is never used
   --> src/api/handlers.rs:425:14
    |
425 | pub async fn update_agent_status(
    |              ^^^^^^^^^^^^^^^^^^^
warning: fields `status`, `agent_id`, `verb`, and `limit` are never read
   --> src/api/handlers.rs:469:9
    |
468 | pub struct CommandListQuery {
    |            ---------------- fields in this struct
469 |     pub status: Option<String>,
    |         ^^^^^^
470 |     pub agent_id: Option<String>,
    |         ^^^^^^^^
471 |     pub verb: Option<String>,
    |         ^^^^
472 |     pub limit: Option<usize>,
    |         ^^^^^
    |
    = note: `CommandListQuery` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis
warning: fields `limit` and `hours` are never read
   --> src/api/handlers.rs:477:9
    |
476 | pub struct TelemetryHistoryQuery {
    |            --------------------- fields in this struct
477 |     pub limit: Option<usize>,
    |         ^^^^^
478 |     pub hours: Option<u32>,
    |         ^^^^^
    |
    = note: `TelemetryHistoryQuery` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis
warning: function `configure_routes` is never used
 --> src/api/routes.rs:6:8
  |
6 | pub fn configure_routes(cfg: &mut web::ServiceConfig) {
  |        ^^^^^^^^^^^^^^^^
warning: function `websocket_handler` is never used
  --> src/api/routes.rs:54:10
   |
54 | async fn websocket_handler() -> HttpResponse {
   |          ^^^^^^^^^^^^^^^^^
warning: fields `data_layer`, `agent_manager`, `executor`, `active_commands`, `command_semaphore`, and `is_running` are never read
  --> src/command/engine.rs:19:5
   |
17 | pub struct CommandEngine {
   |            ------------- fields in this struct
18 |     config: Config,
19 |     data_layer: DataLayer,
   |     ^^^^^^^^^^
20 |     agent_manager: Arc<AgentManager>,
   |     ^^^^^^^^^^^^^
21 |     queue: Arc<CommandQueue>,
22 |     executor: Arc<CommandExecutor>,
   |     ^^^^^^^^
23 |     active_commands: Arc<DashMap<String, QueuedCommand>>, // correlation_id -> command
   |     ^^^^^^^^^^^^^^^
24 |     command_semaphore: Arc<Semaphore>,
   |     ^^^^^^^^^^^^^^^^^
25 |     is_running: Arc<RwLock<bool>>,
   |     ^^^^^^^^^^
warning: multiple methods are never used
   --> src/command/engine.rs:60:18
    |
28  | impl CommandEngine {
    | ------------------ methods in this implementation
...
60  |     pub async fn start(&self) -> BackendAgentResult<()> {
    |                  ^^^^^
...
73  |     pub async fn stop(&self) -> BackendAgentResult<()> {
    |                  ^^^^
...
89  |     pub async fn submit_command(&self, command: CommandRecord) -> BackendAgentResult<String> {
    |                  ^^^^^^^^^^^^^^
...
108 |     pub async fn execute_command(
    |                  ^^^^^^^^^^^^^^^
...
180 |     pub async fn process_command_result(
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
209 |     pub async fn process_command_failure(
    |                  ^^^^^^^^^^^^^^^^^^^^^^^
...
238 |     pub async fn get_command(&self, correlation_id: &str) -> Option<QueuedCommand> {
    |                  ^^^^^^^^^^^
...
243 |     pub async fn get_pending_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^
...
248 |     pub async fn get_executing_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
253 |     pub async fn get_completed_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
258 |     pub async fn get_failed_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^
...
263 |     pub async fn get_commands_by_status(&self, status: &CommandStatus) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
268 |     pub async fn get_commands_for_agent(&self, agent_id: &str) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
273 |     pub async fn get_commands_by_verb(&self, verb: &str) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^
...
278 |     pub async fn retry_command(&self, correlation_id: &str) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^
...
295 |     pub async fn get_statistics(&self) -> CommandEngineStats {
    |                  ^^^^^^^^^^^^^^
...
308 |     pub async fn run_command_loop(&self) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^
...
375 |     async fn wait_for_active_commands(&self) {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^
...
431 |     pub async fn cancel_command(&self, correlation_id: &str) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^
...
454 |     pub async fn get_command_history(&self, limit: Option<usize>) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^
warning: struct `CommandEngineStats` is never constructed
   --> src/command/engine.rs:480:12
    |
480 | pub struct CommandEngineStats {
    |            ^^^^^^^^^^^^^^^^^^
warning: fields `max_concurrent_commands` and `command_timeout` are never read
  --> src/command/executor.rs:9:5
   |
8  | pub struct CommandExecutor {
   |            --------------- fields in this struct
9  |     max_concurrent_commands: usize,
   |     ^^^^^^^^^^^^^^^^^^^^^^^
10 |     command_timeout: u64,
   |     ^^^^^^^^^^^^^^^
   |
   = note: `CommandExecutor` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis
warning: multiple methods are never used
   --> src/command/executor.rs:22:18
    |
13  | impl CommandExecutor {
    | -------------------- methods in this implementation
...
22  |     pub async fn validate_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^
...
56  |     async fn validate_command_schema(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^
...
82  |     async fn validate_exec_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^
...
101 |     async fn validate_docker_ps_command(&self, _command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
107 |     async fn validate_docker_inspect_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
130 |     async fn validate_docker_logs_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
161 |     async fn validate_docker_stats_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
180 |     async fn validate_docker_top_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
199 |     async fn validate_docker_exec_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
233 |     async fn validate_docker_run_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
261 |     async fn validate_docker_stop_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
283 |     async fn validate_docker_rm_command(&self, command: &CommandRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^
...
302 |     async fn validate_docker_pull_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
324 |     async fn validate_docker_build_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
355 |     async fn validate_docker_compose_up_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
378 |     async fn validate_docker_compose_down_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
401 |     async fn validate_docker_compose_ps_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
424 |     async fn validate_docker_compose_logs_command(
    |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
456 |     pub async fn execute_command(
    |                  ^^^^^^^^^^^^^^^
...
496 |     pub async fn get_execution_stats(&self) -> ExecutionStats {
    |                  ^^^^^^^^^^^^^^^^^^^
warning: struct `ExecutionStats` is never constructed
   --> src/command/executor.rs:505:12
    |
505 | pub struct ExecutionStats {
    |            ^^^^^^^^^^^^^^
warning: associated items `new`, `with_priority`, `increment_retry`, and `can_retry` are never used
  --> src/command/queue.rs:19:12
   |
18 | impl QueuedCommand {
   | ------------------ associated items in this implementation
19 |     pub fn new(command: CommandRecord) -> Self {
   |            ^^^
...
28 |     pub fn with_priority(mut self, priority: CommandPriority) -> Self {
   |            ^^^^^^^^^^^^^
...
33 |     pub fn increment_retry(&mut self) {
   |            ^^^^^^^^^^^^^^^
...
37 |     pub fn can_retry(&self) -> bool {
   |            ^^^^^^^^^
warning: fields `pending`, `executing`, `priority_queue`, and `max_queue_size` are never read
  --> src/command/queue.rs:61:5
   |
60 | pub struct CommandQueue {
   |            ------------ fields in this struct
61 |     pending: Arc<DashMap<String, QueuedCommand>>, // correlation_id -> command
   |     ^^^^^^^
62 |     executing: Arc<DashMap<String, QueuedCommand>>, // correlation_id -> command
   |     ^^^^^^^^^
...
65 |     priority_queue: Arc<RwLock<BinaryHeap<QueuedCommand>>>,
   |     ^^^^^^^^^^^^^^
66 |     max_queue_size: usize,
   |     ^^^^^^^^^^^^^^
   |
   = note: `CommandQueue` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis
warning: multiple methods are never used
   --> src/command/queue.rs:82:18
    |
69  | impl CommandQueue {
    | ----------------- methods in this implementation
...
82  |     pub async fn enqueue(&self, command: CommandRecord) -> BackendAgentResult<()> {
    |                  ^^^^^^^
...
112 |     pub async fn dequeue(&self) -> Option<QueuedCommand> {
    |                  ^^^^^^^
...
136 |     pub async fn mark_completed(
    |                  ^^^^^^^^^^^^^^
...
162 |     pub async fn mark_failed(
    |                  ^^^^^^^^^^^
...
188 |     pub async fn retry_command(&self, correlation_id: &str) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^
...
227 |     pub async fn get_command(&self, correlation_id: &str) -> Option<QueuedCommand> {
    |                  ^^^^^^^^^^^
...
245 |     pub async fn get_pending_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^
...
250 |     pub async fn get_executing_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
255 |     pub async fn get_completed_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
260 |     pub async fn get_failed_commands(&self) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^
...
265 |     pub async fn get_statistics(&self) -> QueueStatistics {
    |                  ^^^^^^^^^^^^^^
...
329 |     pub async fn get_commands_by_status(&self, status: &CommandStatus) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
340 |     pub async fn get_commands_by_priority(&self, priority: &CommandPriority) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^
...
359 |     pub async fn get_commands_for_agent(&self, agent_id: &str) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
390 |     pub async fn get_commands_by_verb(&self, verb: &str) -> Vec<QueuedCommand> {
    |                  ^^^^^^^^^^^^^^^^^^^^
warning: struct `QueueStatistics` is never constructed
   --> src/command/queue.rs:422:12
    |
422 | pub struct QueueStatistics {
    |            ^^^^^^^^^^^^^^^
warning: method `health_check` is never used
  --> src/data/mod.rs:27:18
   |
19 | impl DataLayer {
   | -------------- method in this implementation
...
27 |     pub async fn health_check(&self) -> BackendAgentResult<()> {
   |                  ^^^^^^^^^^^^
warning: field `config` is never read
  --> src/data/postgres.rs:11:9
   |
9  | pub struct PostgresClient {
   |            -------------- field in this struct
10 |     pub pool: sqlx::PgPool,
11 |     pub config: DatabaseConfig,
   |         ^^^^^^
   |
   = note: `PostgresClient` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis
warning: multiple methods are never used
   --> src/data/postgres.rs:50:18
    |
14  | impl PostgresClient {
    | ------------------- methods in this implementation
...
50  |     pub async fn health_check(&self) -> Result<(), BackendAgentError> {
    |                  ^^^^^^^^^^^^
...
69  |     pub fn get_pool(&self) -> &PgPool {
    |            ^^^^^^^^
...
238 |     pub async fn upsert_agent(&self, agent: &AgentInfo) -> Result<(), BackendAgentError> {
    |                  ^^^^^^^^^^^^
...
280 |     pub async fn get_agent(&self, agent_id: &str) -> Result<Option<AgentInfo>, BackendAgentError> {
    |                  ^^^^^^^^^
...
319 |     pub async fn list_agents(&self) -> Result<Vec<AgentInfo>, BackendAgentError> {
    |                  ^^^^^^^^^^^
...
354 |     pub async fn update_agent_status(
    |                  ^^^^^^^^^^^^^^^^^^^
...
378 |     pub async fn create_command(&self, command: &CommandRecord) -> Result<(), BackendAgentError> {
    |                  ^^^^^^^^^^^^^^
...
409 |     pub async fn get_command(
    |                  ^^^^^^^^^^^
...
458 |     pub async fn update_command_status(
    |                  ^^^^^^^^^^^^^^^^^^^^^
...
482 |     pub async fn store_telemetry(
    |                  ^^^^^^^^^^^^^^^
...
522 |     pub async fn get_latest_telemetry(
    |                  ^^^^^^^^^^^^^^^^^^^^
...
574 |     pub async fn log_audit_event(&self, audit_log: &AuditLog) -> Result<(), BackendAgentError> {
    |                  ^^^^^^^^^^^^^^^
warning: fields `client`, `manager`, and `config` are never read
  --> src/data/redis.rs:8:9
   |
7  | pub struct RedisClient {
   |            ----------- fields in this struct
8  |     pub client: Client,
   |         ^^^^^^
9  |     pub manager: ConnectionManager,
   |         ^^^^^^^
10 |     pub config: RedisConfig,
   |         ^^^^^^
warning: multiple methods are never used
   --> src/data/redis.rs:48:18
    |
13  | impl RedisClient {
    | ---------------- methods in this implementation
...
48  |     pub async fn health_check(&self) -> Result<(), BackendAgentError> {
    |                  ^^^^^^^^^^^^
...
68  |     pub fn get_manager(&self) -> &ConnectionManager {
    |            ^^^^^^^^^^^
...
76  |     pub async fn set(
    |                  ^^^
...
110 |     pub async fn get(&self, key: &str) -> Result<Option<String>, BackendAgentError> {
    |                  ^^^
...
125 |     pub async fn del(&self, key: &str) -> Result<(), BackendAgentError> {
    |                  ^^^
...
140 |     pub async fn exists(&self, key: &str) -> Result<bool, BackendAgentError> {
    |                  ^^^^^^
...
159 |     pub async fn hset(&self, key: &str, field: &str, value: &str) -> Result<(), BackendAgentError> {
    |                  ^^^^
...
176 |     pub async fn hget(&self, key: &str, field: &str) -> Result<Option<String>, BackendAgentError> {
    |                  ^^^^
...
194 |     pub async fn hgetall(&self, key: &str) -> Result<Vec<(String, String)>, BackendAgentError> {
    |                  ^^^^^^^
...
213 |     pub async fn lpush(&self, key: &str, value: &str) -> Result<(), BackendAgentError> {
    |                  ^^^^^
...
229 |     pub async fn rpop(&self, key: &str) -> Result<Option<String>, BackendAgentError> {
    |                  ^^^^
...
248 |     pub async fn sadd(&self, key: &str, member: &str) -> Result<(), BackendAgentError> {
    |                  ^^^^
...
264 |     pub async fn smembers(&self, key: &str) -> Result<Vec<String>, BackendAgentError> {
    |                  ^^^^^^^^
...
283 |     pub async fn expire(&self, key: &str, seconds: u64) -> Result<bool, BackendAgentError> {
    |                  ^^^^^^
...
299 |     pub async fn ttl(&self, key: &str) -> Result<i64, BackendAgentError> {
    |                  ^^^
warning: variants `Authentication`, `Authorization`, `CommandExecution`, `Connection`, and `RateLimit` are never constructed
  --> src/error.rs:21:5
   |
7  | pub enum BackendAgentError {
   |          ----------------- variants in this enum
...
21 |     Authentication(String),
   |     ^^^^^^^^^^^^^^
...
24 |     Authorization(String),
   |     ^^^^^^^^^^^^^
...
27 |     CommandExecution(String),
   |     ^^^^^^^^^^^^^^^^
...
36 |     Connection(String),
   |     ^^^^^^^^^^
...
45 |     RateLimit(String),
   |     ^^^^^^^^^
   |
   = note: `BackendAgentError` has a derived impl for the trait `Debug`, but this is intentionally ignored during dead code analysis
warning: field `data_layer` is never read
 --> src/telemetry/analytics.rs:9:5
  |
8 | pub struct TelemetryAnalytics {
  |            ------------------ field in this struct
9 |     data_layer: DataLayer,
  |     ^^^^^^^^^^
warning: multiple methods are never used
   --> src/telemetry/analytics.rs:18:18
    |
12  | impl TelemetryAnalytics {
    | ----------------------- methods in this implementation
...
18  |     pub async fn process_telemetry(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^^
...
38  |     async fn check_cpu_alerts(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^
...
62  |     async fn check_memory_alerts(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^
...
87  |     async fn check_disk_alerts(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^
...
116 |     async fn check_container_alerts(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |              ^^^^^^^^^^^^^^^^^^^^^^
...
142 |     pub async fn get_statistics(&self) -> AnalyticsStats {
    |                  ^^^^^^^^^^^^^^
...
153 |     pub async fn generate_health_report(
    |                  ^^^^^^^^^^^^^^^^^^^^^^
...
236 |     pub async fn get_resource_trends(
    |                  ^^^^^^^^^^^^^^^^^^^
warning: struct `AnalyticsStats` is never constructed
   --> src/telemetry/analytics.rs:262:12
    |
262 | pub struct AnalyticsStats {
    |            ^^^^^^^^^^^^^^
warning: struct `HealthReport` is never constructed
   --> src/telemetry/analytics.rs:270:12
    |
270 | pub struct HealthReport {
    |            ^^^^^^^^^^^^
warning: struct `AgentHealthSummary` is never constructed
   --> src/telemetry/analytics.rs:282:12
    |
282 | pub struct AgentHealthSummary {
    |            ^^^^^^^^^^^^^^^^^^
warning: struct `ResourceTrends` is never constructed
   --> src/telemetry/analytics.rs:292:12
    |
292 | pub struct ResourceTrends {
    |            ^^^^^^^^^^^^^^
warning: fields `config`, `data_layer`, `telemetry_queue`, `telemetry_receiver`, and `is_running` are never read
  --> src/telemetry/processor.rs:13:5
   |
12 | pub struct TelemetryProcessor {
   |            ------------------ fields in this struct
13 |     config: Config,
   |     ^^^^^^
14 |     data_layer: DataLayer,
   |     ^^^^^^^^^^
...
17 |     telemetry_queue: Arc<mpsc::UnboundedSender<TelemetryMessage>>,
   |     ^^^^^^^^^^^^^^^
18 |     telemetry_receiver: Arc<RwLock<Option<mpsc::UnboundedReceiver<TelemetryMessage>>>>,
   |     ^^^^^^^^^^^^^^^^^^
19 |     is_running: Arc<RwLock<bool>>,
   |     ^^^^^^^^^^
warning: multiple methods are never used
   --> src/telemetry/processor.rs:49:18
    |
22  | impl TelemetryProcessor {
    | ----------------------- methods in this implementation
...
49  |     pub async fn start(&self) -> BackendAgentResult<()> {
    |                  ^^^^^
...
62  |     pub async fn stop(&self) -> BackendAgentResult<()> {
    |                  ^^^^
...
75  |     pub async fn process_telemetry(
    |                  ^^^^^^^^^^^^^^^^^
...
130 |     pub async fn queue_telemetry(&self, telemetry_msg: TelemetryMessage) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^
...
141 |     pub async fn run_processing_loop(&self) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^^^^^
...
172 |     pub async fn get_statistics(&self) -> TelemetryStats {
    |                  ^^^^^^^^^^^^^^
...
183 |     pub async fn get_latest_telemetry(
    |                  ^^^^^^^^^^^^^^^^^^^^
...
191 |     pub async fn get_telemetry_history(
    |                  ^^^^^^^^^^^^^^^^^^^^^
warning: struct `TelemetryStats` is never constructed
   --> src/telemetry/processor.rs:253:12
    |
253 | pub struct TelemetryStats {
    |            ^^^^^^^^^^^^^^
warning: field `data_layer` is never read
 --> src/telemetry/storage.rs:8:5
  |
7 | pub struct TelemetryStorage {
  |            ---------------- field in this struct
8 |     data_layer: DataLayer,
  |     ^^^^^^^^^^
warning: multiple methods are never used
   --> src/telemetry/storage.rs:17:18
    |
11  | impl TelemetryStorage {
    | --------------------- methods in this implementation
...
17  |     pub async fn store_telemetry(&self, telemetry: &TelemetryRecord) -> BackendAgentResult<()> {
    |                  ^^^^^^^^^^^^^^^
...
44  |     pub async fn get_latest_telemetry(
    |                  ^^^^^^^^^^^^^^^^^^^^
...
90  |     pub async fn get_telemetry_history(
    |                  ^^^^^^^^^^^^^^^^^^^^^
...
133 |     pub async fn get_telemetry_for_agents(
    |                  ^^^^^^^^^^^^^^^^^^^^^^^^
...
170 |     pub async fn get_statistics(&self) -> StorageStats {
    |                  ^^^^^^^^^^^^^^
...
182 |     pub async fn batch_store_telemetry(
    |                  ^^^^^^^^^^^^^^^^^^^^^
...
206 |     pub async fn get_telemetry_summary(
    |                  ^^^^^^^^^^^^^^^^^^^^^
warning: struct `StorageStats` is never constructed
   --> src/telemetry/storage.rs:250:12
    |
250 | pub struct StorageStats {
    |            ^^^^^^^^^^^^
warning: struct `TelemetrySummary` is never constructed
   --> src/telemetry/storage.rs:259:12
    |
259 | pub struct TelemetrySummary {
    |            ^^^^^^^^^^^^^^^^
warning: `viworks-backend-agent` (bin "viworks-backend-agent") generated 105 warnings (run `cargo fix --bin "viworks-backend-agent"` to apply 31 suggestions)
    Finished `release` profile [optimized] target(s) in 2m 51s
warning: the following packages contain code that will be rejected by a future version of Rust: redis v0.24.0, sqlx-postgres v0.7.4
note: to see what the problems were, use the option `--future-incompat-report`, or run `cargo report future-incompatibilities --id 1`
Build successful!
-rwxr-xr-x 2 root root 7181976 Sep  5 12:16 target/release/viworks-backend-agent
target/release/viworks-backend-agent: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=d72152ca4ee38ebb15bd88d6ba4590c2e3c9c1d0, for GNU/Linux 3.2.0, stripped
Binary size: 7181976 bytes
Binary ready at /tmp/viworks-backend-agent-built
0s
Run # Copy binary from build container
-rwxr-xr-x 1 runner docker 7181976 Sep  5 12:16 viworks-backend-agent-built
viworks-backend-agent-built: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=d72152ca4ee38ebb15bd88d6ba4590c2e3c9c1d0, for GNU/Linux 3.2.0, stripped
Built binary size: 7181976 bytes
✅ Binary size is in expected range
3s
Run # Clean up build container
  
viworks-build-temp
2s
Run actions/upload-artifact@v4
With the provided path, there will be 1 file uploaded
Artifact name is valid!
Root directory input is valid!
Beginning upload of artifact content to blob storage
Uploaded bytes 3085217
Finished uploading artifact content to blob storage!
SHA256 digest of uploaded artifact zip is 80430eb0ff6fc15f90b26f9c181c94c14da9603063516b6d53234b1a46e3efd7
Finalizing artifact upload
Artifact viworks-backend-agent-built.zip successfully finalized. Artifact ID 3936782576
Artifact viworks-backend-agent-built has been successfully uploaded! Final size is 3085217 bytes. Artifact ID is 3936782576
Artifact download URL: https://github.com/apebrahimi/viworkdemo002/actions/runs/17492755273/artifacts/3936782576
0s
Post job cleanup.
Removing builder
Cleaning up certificates
Post cache
  
1s
Post job cleanup.
/usr/bin/git version
git version 2.51.0
Temporarily overriding HOME='/home/runner/work/_temp/b38a5517-b684-4088-a1e3-42d4d7d2ba10' before making global git config changes
Adding repository directory to the temporary git global config as a safe directory
/usr/bin/git config --global --add safe.directory /home/runner/work/viworkdemo002/viworkdemo002
/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
http.https://github.com/.extraheader
/usr/bin/git config --local --unset-all http.https://github.com/.extraheader
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"

step3: 
Deploy Backend Agent
succeeded now in 1m 0s

2s
Current runner version: '2.328.0'
Runner Image Provisioner
Operating System
Runner Image
GITHUB_TOKEN Permissions
Secret source: Actions
Prepare workflow directory
Prepare all required actions
Getting action download info
Download action repository 'actions/checkout@v4' (SHA:08eba0b27e820071cde6df949e0beb9ba4906955)
Download action repository 'actions/download-artifact@v4' (SHA:d3f86a106a0bac45b974a628896c90dbdf5c8093)
Download action repository 'appleboy/scp-action@v0.1.4' (SHA:8a92fcdb1eb4ffbf538b2fa286739760aac8a95b)
Download action repository 'appleboy/ssh-action@v0.1.5' (SHA:f9010ff7f1bbd7db1a0b4bab661437550cea20c0)
Complete job name: Deploy Backend Agent
10s
Build container for action use: '/home/runner/work/_actions/appleboy/scp-action/v0.1.4/Dockerfile'.
2s
Build container for action use: '/home/runner/work/_actions/appleboy/ssh-action/v0.1.5/Dockerfile'.
1s
Run actions/checkout@v4
Syncing repository: apebrahimi/viworkdemo002
Getting Git version info
Temporarily overriding HOME='/home/runner/work/_temp/df2813e2-e9f0-4342-b358-ed0b112e800c' before making global git config changes
Adding repository directory to the temporary git global config as a safe directory
/usr/bin/git config --global --add safe.directory /home/runner/work/viworkdemo002/viworkdemo002
Deleting the contents of '/home/runner/work/viworkdemo002/viworkdemo002'
Initializing the repository
Disabling automatic garbage collection
Setting up auth
Fetching the repository
Determining the checkout info
/usr/bin/git sparse-checkout disable
/usr/bin/git config --local --unset-all extensions.worktreeConfig
Checking out the ref
/usr/bin/git log -1 --format=%H
f6461d8be73871f5de720a5933e3f1005a4486be
2s
Run actions/download-artifact@v4
Downloading single artifact
Preparing to download the following artifacts:
- viworks-backend-agent-built (ID: 3936782576, Size: 3085217, Expected Digest: sha256:80430eb0ff6fc15f90b26f9c181c94c14da9603063516b6d53234b1a46e3efd7)
Redirecting to blob download url: https://productionresultssa5.blob.core.windows.net/actions-results/b32c6636-1a79-4074-92ce-442ad426a37f/workflow-job-run-de1d4c79-6fc9-58bf-82dd-628acf626ba2/artifacts/57a731019ee57d09acf9cf9b5b9683b16c74c9f99611ec4b9b398be1bd760532.zip
Starting download of artifact to: /home/runner/work/viworkdemo002/viworkdemo002
(node:2329) [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues. Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
SHA256 digest of downloaded artifact is 80430eb0ff6fc15f90b26f9c181c94c14da9603063516b6d53234b1a46e3efd7
Artifact download completed successfully.
Total of 1 artifact(s) downloaded
Download artifact has finished successfully
0s
Run ls -la viworks-backend-agent-built
-rw-r--r-- 1 runner docker 7181976 Sep  5 12:16 viworks-backend-agent-built
viworks-backend-agent-built: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=d72152ca4ee38ebb15bd88d6ba4590c2e3c9c1d0, for GNU/Linux 3.2.0, stripped
Deploying binary size: 7181976 bytes
12s
Run appleboy/scp-action@v0.1.4
/usr/bin/docker run --name b66e875e296279a0d44d8c86acc7588a920d77_f025f2 --label b66e87 --workdir /github/workspace --rm -e "CARGO_TERM_COLOR" -e "INPUT_HOST" -e "INPUT_USERNAME" -e "INPUT_KEY" -e "INPUT_SOURCE" -e "INPUT_TARGET" -e "INPUT_STRIP_COMPONENTS" -e "INPUT_PORT" -e "INPUT_PASSWORD" -e "INPUT_TIMEOUT" -e "INPUT_COMMAND_TIMEOUT" -e "INPUT_KEY_PATH" -e "INPUT_PASSPHRASE" -e "INPUT_FINGERPRINT" -e "INPUT_USE_INSECURE_CIPHER" -e "INPUT_RM" -e "INPUT_DEBUG" -e "INPUT_OVERWRITE" -e "INPUT_TAR_DEREFERENCE" -e "INPUT_TAR_TMP_PATH" -e "INPUT_TAR_EXEC" -e "INPUT_PROXY_HOST" -e "INPUT_PROXY_PORT" -e "INPUT_PROXY_USERNAME" -e "INPUT_PROXY_PASSWORD" -e "INPUT_PROXY_PASSPHRASE" -e "INPUT_PROXY_TIMEOUT" -e "INPUT_PROXY_KEY" -e "INPUT_PROXY_KEY_PATH" -e "INPUT_PROXY_FINGERPRINT" -e "INPUT_PROXY_USE_INSECURE_CIPHER" -e "HOME" -e "GITHUB_JOB" -e "GITHUB_REF" -e "GITHUB_SHA" -e "GITHUB_REPOSITORY" -e "GITHUB_REPOSITORY_OWNER" -e "GITHUB_REPOSITORY_OWNER_ID" -e "GITHUB_RUN_ID" -e "GITHUB_RUN_NUMBER" -e "GITHUB_RETENTION_DAYS" -e "GITHUB_RUN_ATTEMPT" -e "GITHUB_ACTOR_ID" -e "GITHUB_ACTOR" -e "GITHUB_WORKFLOW" -e "GITHUB_HEAD_REF" -e "GITHUB_BASE_REF" -e "GITHUB_EVENT_NAME" -e "GITHUB_SERVER_URL" -e "GITHUB_API_URL" -e "GITHUB_GRAPHQL_URL" -e "GITHUB_REF_NAME" -e "GITHUB_REF_PROTECTED" -e "GITHUB_REF_TYPE" -e "GITHUB_WORKFLOW_REF" -e "GITHUB_WORKFLOW_SHA" -e "GITHUB_REPOSITORY_ID" -e "GITHUB_TRIGGERING_ACTOR" -e "GITHUB_WORKSPACE" -e "GITHUB_ACTION" -e "GITHUB_EVENT_PATH" -e "GITHUB_ACTION_REPOSITORY" -e "GITHUB_ACTION_REF" -e "GITHUB_PATH" -e "GITHUB_ENV" -e "GITHUB_STEP_SUMMARY" -e "GITHUB_STATE" -e "GITHUB_OUTPUT" -e "RUNNER_OS" -e "RUNNER_ARCH" -e "RUNNER_NAME" -e "RUNNER_ENVIRONMENT" -e "RUNNER_TOOL_CACHE" -e "RUNNER_TEMP" -e "RUNNER_WORKSPACE" -e "ACTIONS_RUNTIME_URL" -e "ACTIONS_RUNTIME_TOKEN" -e "ACTIONS_CACHE_URL" -e "ACTIONS_RESULTS_URL" -e GITHUB_ACTIONS=true -e CI=true -v "/var/run/docker.sock":"/var/run/docker.sock" -v "/home/runner/work/_temp/_github_home":"/github/home" -v "/home/runner/work/_temp/_github_workflow":"/github/workflow" -v "/home/runner/work/_temp/_runner_file_commands":"/github/file_commands" -v "/home/runner/work/viworkdemo002/viworkdemo002":"/github/workspace" b66e87:5e296279a0d44d8c86acc7588a920d77
tar all files into /tmp/VJNkTnMEgq.tar.gz
scp file to server.
create folder /opt/viworks/deployments/backend-agent/viworks-backend-agent
untar file VJNkTnMEgq.tar.gz
remove file VJNkTnMEgq.tar.gz
===================================================
✅ Successfully executed transfer data to all host
===================================================
11s
Run appleboy/scp-action@v0.1.4
/usr/bin/docker run --name b66e875e296279a0d44d8c86acc7588a920d77_231804 --label b66e87 --workdir /github/workspace --rm -e "CARGO_TERM_COLOR" -e "INPUT_HOST" -e "INPUT_USERNAME" -e "INPUT_KEY" -e "INPUT_SOURCE" -e "INPUT_TARGET" -e "INPUT_STRIP_COMPONENTS" -e "INPUT_PORT" -e "INPUT_PASSWORD" -e "INPUT_TIMEOUT" -e "INPUT_COMMAND_TIMEOUT" -e "INPUT_KEY_PATH" -e "INPUT_PASSPHRASE" -e "INPUT_FINGERPRINT" -e "INPUT_USE_INSECURE_CIPHER" -e "INPUT_RM" -e "INPUT_DEBUG" -e "INPUT_OVERWRITE" -e "INPUT_TAR_DEREFERENCE" -e "INPUT_TAR_TMP_PATH" -e "INPUT_TAR_EXEC" -e "INPUT_PROXY_HOST" -e "INPUT_PROXY_PORT" -e "INPUT_PROXY_USERNAME" -e "INPUT_PROXY_PASSWORD" -e "INPUT_PROXY_PASSPHRASE" -e "INPUT_PROXY_TIMEOUT" -e "INPUT_PROXY_KEY" -e "INPUT_PROXY_KEY_PATH" -e "INPUT_PROXY_FINGERPRINT" -e "INPUT_PROXY_USE_INSECURE_CIPHER" -e "HOME" -e "GITHUB_JOB" -e "GITHUB_REF" -e "GITHUB_SHA" -e "GITHUB_REPOSITORY" -e "GITHUB_REPOSITORY_OWNER" -e "GITHUB_REPOSITORY_OWNER_ID" -e "GITHUB_RUN_ID" -e "GITHUB_RUN_NUMBER" -e "GITHUB_RETENTION_DAYS" -e "GITHUB_RUN_ATTEMPT" -e "GITHUB_ACTOR_ID" -e "GITHUB_ACTOR" -e "GITHUB_WORKFLOW" -e "GITHUB_HEAD_REF" -e "GITHUB_BASE_REF" -e "GITHUB_EVENT_NAME" -e "GITHUB_SERVER_URL" -e "GITHUB_API_URL" -e "GITHUB_GRAPHQL_URL" -e "GITHUB_REF_NAME" -e "GITHUB_REF_PROTECTED" -e "GITHUB_REF_TYPE" -e "GITHUB_WORKFLOW_REF" -e "GITHUB_WORKFLOW_SHA" -e "GITHUB_REPOSITORY_ID" -e "GITHUB_TRIGGERING_ACTOR" -e "GITHUB_WORKSPACE" -e "GITHUB_ACTION" -e "GITHUB_EVENT_PATH" -e "GITHUB_ACTION_REPOSITORY" -e "GITHUB_ACTION_REF" -e "GITHUB_PATH" -e "GITHUB_ENV" -e "GITHUB_STEP_SUMMARY" -e "GITHUB_STATE" -e "GITHUB_OUTPUT" -e "RUNNER_OS" -e "RUNNER_ARCH" -e "RUNNER_NAME" -e "RUNNER_ENVIRONMENT" -e "RUNNER_TOOL_CACHE" -e "RUNNER_TEMP" -e "RUNNER_WORKSPACE" -e "ACTIONS_RUNTIME_URL" -e "ACTIONS_RUNTIME_TOKEN" -e "ACTIONS_CACHE_URL" -e "ACTIONS_RESULTS_URL" -e GITHUB_ACTIONS=true -e CI=true -v "/var/run/docker.sock":"/var/run/docker.sock" -v "/home/runner/work/_temp/_github_home":"/github/home" -v "/home/runner/work/_temp/_github_workflow":"/github/workflow" -v "/home/runner/work/_temp/_runner_file_commands":"/github/file_commands" -v "/home/runner/work/viworkdemo002/viworkdemo002":"/github/workspace" b66e87:5e296279a0d44d8c86acc7588a920d77
tar all files into /tmp/xyylwmCyIK.tar.gz
scp file to server.
create folder /opt/viworks/deployments/backend-agent/
untar file xyylwmCyIK.tar.gz
remove file xyylwmCyIK.tar.gz
===================================================
✅ Successfully executed transfer data to all host
===================================================
17s
Run appleboy/ssh-action@v0.1.5
/usr/bin/docker run --name b66e87f9068a15206f443282f9fd72532cec8a_22244b --label b66e87 --workdir /github/workspace --rm -e "CARGO_TERM_COLOR" -e "INPUT_HOST" -e "INPUT_USERNAME" -e "INPUT_KEY" -e "INPUT_SCRIPT" -e "INPUT_PORT" -e "INPUT_PASSPHRASE" -e "INPUT_PASSWORD" -e "INPUT_SYNC" -e "INPUT_USE_INSECURE_CIPHER" -e "INPUT_CIPHER" -e "INPUT_TIMEOUT" -e "INPUT_COMMAND_TIMEOUT" -e "INPUT_KEY_PATH" -e "INPUT_FINGERPRINT" -e "INPUT_PROXY_HOST" -e "INPUT_PROXY_PORT" -e "INPUT_PROXY_USERNAME" -e "INPUT_PROXY_PASSWORD" -e "INPUT_PROXY_PASSPHRASE" -e "INPUT_PROXY_TIMEOUT" -e "INPUT_PROXY_KEY" -e "INPUT_PROXY_KEY_PATH" -e "INPUT_PROXY_FINGERPRINT" -e "INPUT_PROXY_CIPHER" -e "INPUT_PROXY_USE_INSECURE_CIPHER" -e "INPUT_SCRIPT_STOP" -e "INPUT_ENVS" -e "INPUT_DEBUG" -e "HOME" -e "GITHUB_JOB" -e "GITHUB_REF" -e "GITHUB_SHA" -e "GITHUB_REPOSITORY" -e "GITHUB_REPOSITORY_OWNER" -e "GITHUB_REPOSITORY_OWNER_ID" -e "GITHUB_RUN_ID" -e "GITHUB_RUN_NUMBER" -e "GITHUB_RETENTION_DAYS" -e "GITHUB_RUN_ATTEMPT" -e "GITHUB_ACTOR_ID" -e "GITHUB_ACTOR" -e "GITHUB_WORKFLOW" -e "GITHUB_HEAD_REF" -e "GITHUB_BASE_REF" -e "GITHUB_EVENT_NAME" -e "GITHUB_SERVER_URL" -e "GITHUB_API_URL" -e "GITHUB_GRAPHQL_URL" -e "GITHUB_REF_NAME" -e "GITHUB_REF_PROTECTED" -e "GITHUB_REF_TYPE" -e "GITHUB_WORKFLOW_REF" -e "GITHUB_WORKFLOW_SHA" -e "GITHUB_REPOSITORY_ID" -e "GITHUB_TRIGGERING_ACTOR" -e "GITHUB_WORKSPACE" -e "GITHUB_ACTION" -e "GITHUB_EVENT_PATH" -e "GITHUB_ACTION_REPOSITORY" -e "GITHUB_ACTION_REF" -e "GITHUB_PATH" -e "GITHUB_ENV" -e "GITHUB_STEP_SUMMARY" -e "GITHUB_STATE" -e "GITHUB_OUTPUT" -e "RUNNER_OS" -e "RUNNER_ARCH" -e "RUNNER_NAME" -e "RUNNER_ENVIRONMENT" -e "RUNNER_TOOL_CACHE" -e "RUNNER_TEMP" -e "RUNNER_WORKSPACE" -e "ACTIONS_RUNTIME_URL" -e "ACTIONS_RUNTIME_TOKEN" -e "ACTIONS_CACHE_URL" -e "ACTIONS_RESULTS_URL" -e GITHUB_ACTIONS=true -e CI=true -v "/var/run/docker.sock":"/var/run/docker.sock" -v "/home/runner/work/_temp/_github_home":"/github/home" -v "/home/runner/work/_temp/_github_workflow":"/github/workflow" -v "/home/runner/work/_temp/_runner_file_commands":"/github/file_commands" -v "/home/runner/work/viworkdemo002/viworkdemo002":"/github/workspace" b66e87:f9068a15206f443282f9fd72532cec8a
======CMD======
# Make binary executable
chmod +x /opt/viworks/deployments/backend-agent/viworks-backend-agent

# Stop current agent process
docker exec viworks-backend-agent-new bash -c "pkill -f viworks-backend-agent" || true

# Wait for process to stop
sleep 5

# Copy binary to container
docker cp /opt/viworks/deployments/backend-agent/viworks-backend-agent viworks-backend-agent-new:/app/

# Copy configuration to container
docker cp /opt/viworks/deployments/backend-agent/config/backend-agent.toml viworks-backend-agent-new:/app/config/

# Start container with new binary
docker exec viworks-backend-agent-new bash -c "cd /app && nohup ./viworks-backend-agent > /dev/null 2>&1 &"

# Wait for startup
sleep 10

# Verify deployment
curl -k https://agent.neuratalent.com/health || {
  echo "Deployment verification failed, rolling back..."
  docker exec viworks-backend-agent-new bash -c "pkill -f viworks-backend-agent"
  if [ -f /opt/viworks/deployments/backend-agent/viworks-backend-agent.backup.$(date +%Y%m%d_%H%M%S) ]; then
    cp /opt/viworks/deployments/backend-agent/viworks-backend-agent.backup.$(date +%Y%m%d_%H%M%S) /opt/viworks/deployments/backend-agent/viworks-backend-agent
    docker exec viworks-backend-agent-new bash -c "cd /app && nohup ./viworks-backend-agent > /dev/null 2>&1 &"
  fi
  exit 1
}

echo "Deployment successful!"

======END======
err: Error response from daemon: cannot overwrite non-directory "/app/viworks-backend-agent" with directory "/app"
err: lstat /opt/viworks/deployments/backend-agent/config: no such file or directory
err:   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
err:                                  Dload  Upload   Total   Spent    Left  Speed
err: 
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100    56  100    56    0     0   2179      0 --:--:-- --:--:-- --:--:--  2240
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
out: Service temporarily unavailable. Please try again later.Deployment successful!
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
out: 
err: 
out: 
out: 
err: 
err: 
err: 
err: 
err: 
out: 
err: 
err: 
err: 
err: 
err: 
out: 
err: 
err: 
out: 
err: 
out: 
out: 
err: 
err: 
err: 
err: 
==============================================
✅ Successfully executed commands to all host.
==============================================
0s
Post job cleanup.
/usr/bin/git version
git version 2.51.0
Temporarily overriding HOME='/home/runner/work/_temp/8a658a00-7694-4c9b-a9b0-12a116b8d0b9' before making global git config changes
Adding repository directory to the temporary git global config as a safe directory
/usr/bin/git config --global --add safe.directory /home/runner/work/viworkdemo002/viworkdemo002
/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
http.https://github.com/.extraheader
/usr/bin/git config --local --unset-all http.https://github.com/.extraheader
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
0s
Cleaning up orphan processes


step 4: 
Health Check
succeeded now in 11s

2s
Current runner version: '2.328.0'
Runner Image Provisioner
Operating System
Runner Image
GITHUB_TOKEN Permissions
Secret source: Actions
Prepare workflow directory
Prepare all required actions
Getting action download info
Download action repository 'appleboy/ssh-action@v0.1.5' (SHA:f9010ff7f1bbd7db1a0b4bab661437550cea20c0)
Complete job name: Health Check
6s
Build container for action use: '/home/runner/work/_actions/appleboy/ssh-action/v0.1.5/Dockerfile'.
2s
Run appleboy/ssh-action@v0.1.5
/usr/bin/docker run --name d227213a68a4dcd9441a994a59a5306ca1e97_e95464 --label 6d2272 --workdir /github/workspace --rm -e "CARGO_TERM_COLOR" -e "INPUT_HOST" -e "INPUT_USERNAME" -e "INPUT_KEY" -e "INPUT_SCRIPT" -e "INPUT_PORT" -e "INPUT_PASSPHRASE" -e "INPUT_PASSWORD" -e "INPUT_SYNC" -e "INPUT_USE_INSECURE_CIPHER" -e "INPUT_CIPHER" -e "INPUT_TIMEOUT" -e "INPUT_COMMAND_TIMEOUT" -e "INPUT_KEY_PATH" -e "INPUT_FINGERPRINT" -e "INPUT_PROXY_HOST" -e "INPUT_PROXY_PORT" -e "INPUT_PROXY_USERNAME" -e "INPUT_PROXY_PASSWORD" -e "INPUT_PROXY_PASSPHRASE" -e "INPUT_PROXY_TIMEOUT" -e "INPUT_PROXY_KEY" -e "INPUT_PROXY_KEY_PATH" -e "INPUT_PROXY_FINGERPRINT" -e "INPUT_PROXY_CIPHER" -e "INPUT_PROXY_USE_INSECURE_CIPHER" -e "INPUT_SCRIPT_STOP" -e "INPUT_ENVS" -e "INPUT_DEBUG" -e "HOME" -e "GITHUB_JOB" -e "GITHUB_REF" -e "GITHUB_SHA" -e "GITHUB_REPOSITORY" -e "GITHUB_REPOSITORY_OWNER" -e "GITHUB_REPOSITORY_OWNER_ID" -e "GITHUB_RUN_ID" -e "GITHUB_RUN_NUMBER" -e "GITHUB_RETENTION_DAYS" -e "GITHUB_RUN_ATTEMPT" -e "GITHUB_ACTOR_ID" -e "GITHUB_ACTOR" -e "GITHUB_WORKFLOW" -e "GITHUB_HEAD_REF" -e "GITHUB_BASE_REF" -e "GITHUB_EVENT_NAME" -e "GITHUB_SERVER_URL" -e "GITHUB_API_URL" -e "GITHUB_GRAPHQL_URL" -e "GITHUB_REF_NAME" -e "GITHUB_REF_PROTECTED" -e "GITHUB_REF_TYPE" -e "GITHUB_WORKFLOW_REF" -e "GITHUB_WORKFLOW_SHA" -e "GITHUB_REPOSITORY_ID" -e "GITHUB_TRIGGERING_ACTOR" -e "GITHUB_WORKSPACE" -e "GITHUB_ACTION" -e "GITHUB_EVENT_PATH" -e "GITHUB_ACTION_REPOSITORY" -e "GITHUB_ACTION_REF" -e "GITHUB_PATH" -e "GITHUB_ENV" -e "GITHUB_STEP_SUMMARY" -e "GITHUB_STATE" -e "GITHUB_OUTPUT" -e "RUNNER_OS" -e "RUNNER_ARCH" -e "RUNNER_NAME" -e "RUNNER_ENVIRONMENT" -e "RUNNER_TOOL_CACHE" -e "RUNNER_TEMP" -e "RUNNER_WORKSPACE" -e "ACTIONS_RUNTIME_URL" -e "ACTIONS_RUNTIME_TOKEN" -e "ACTIONS_CACHE_URL" -e "ACTIONS_RESULTS_URL" -e GITHUB_ACTIONS=true -e CI=true -v "/var/run/docker.sock":"/var/run/docker.sock" -v "/home/runner/work/_temp/_github_home":"/github/home" -v "/home/runner/work/_temp/_github_workflow":"/github/workflow" -v "/home/runner/work/_temp/_runner_file_commands":"/github/file_commands" -v "/home/runner/work/viworkdemo002/viworkdemo002":"/github/workspace" 6d2272:13a68a4dcd9441a994a59a5306ca1e97
======CMD======
echo "=== Health Check ==="

# Check container status
echo "Container status:"
docker ps | grep viworks-backend-agent-new

# Check binary size
echo "Binary size:"
docker exec viworks-backend-agent-new ls -la /app/viworks-backend-agent

# Test health endpoint
echo "Testing health endpoint:"
curl -k https://agent.neuratalent.com/health

# Test API endpoint
echo "Testing API endpoint:"
curl -k https://agent.neuratalent.com/api/v1/status

echo "Health check completed!"

======END======
out: === Health Check ===
out: Container status:
out: 0c1ee291c468   debian:latest                 "tail -f /dev/null"      20 hours ago    Up About an hour         0.0.0.0:8080-8081->8080-8081/tcp, [::]:8080-8081->8080-8081/tcp                viworks-backend-agent-new
out: Binary size:
out: -rwxr-xr-x 1 *** *** 6437216 Sep  5 07:18 /app/viworks-backend-agent
out: Testing health endpoint:
err:   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
err:                                  Dload  Upload   Total   Spent    Left  Speed
err: 
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100    56  100    56    0     0   4455      0 --:--:-- --:--:-- --:--:--  4666
out: Service temporarily unavailable. Please try again later.Testing API endpoint:
err:   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
err:                                  Dload  Upload   Total   Spent    Left  Speed
err: 
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100    56  100    56    0     0    350      0 --:--:-- --:--:-- --:--:--   352
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
out: Service temporarily unavailable. Please try again later.Health check completed!
err: 
out: 
out: 
err: 
err: 
out: 
out: 
err: 
err: 
err: 
out: 
out: 
out: 
out: 
out: 
out: 
out: 
out: 
out: 
out: 
out: 
out: 
out: 
out: 
err: 
err: 
out: 
err: 
out: 
err: 
out: 
out: 
err: 
err: 
err: 
err: 
err: 
out: 
err: 
out: 
err: 
out: 
err: 
out: 
out: 
err: 
err: 
err: 
out: 
out: 
out: 
err: 
err: 
err: 
out: 
out: 
err: 
err: 
out: 
err: 
out: 
err: 
out: 
out: 
out: 
err: 
out: 
out: 
out: 
out: 
out: 
err: 
err: 
err: 
err: 
out: 
out: 
out: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
err: 
out: 
err: 
out: 
out: 
out: 
out: 
out: 
out: 
err: 
out: 
err: 
err: 
out: 
out: 
err: 
err: 
err: 
out: 
err: 
out: 
out: 
out: 
err: 
out: 
out: 
out: 
err: 
err: 
err: 
out: 
out: 
err: 
err: 
out: 
out: 
err: 
err: 
out: 
err: 
out: 
err: 
out: 
out: 
out: 
err: 
err: 
out: 
out: 
out: 
out: 
out: 
out: 
out: 
err: 
out: 
out: 
out: 
out: 
err: 
err: 
err: 
err: 
out: 
out: 
err: 
out: 
err: 
err: 
out: 
out: 
err: 
out: 
out: 
out: 
err: 
err: 
out: 
err: 
out: 
out: 
out: 
out: 
err: 
err: 
err: 
out: 
err: 
err: 
err: 
err: 
err: 
err: 
out: 
err: 
out: 
out: 
out: 
out: 
out: 
err: 
out: 
err: 
err: 
err: 
err: 
err: 
out: 
out: 
out: 
err: 
out: 
err: 
err: 
out: 
out: 
out: 
err: 
out: 
out: 
out: 
out: 
out: 
out: 
err: 
err: 
out: 
err: 
err: 
err: 
err: 
err: 
out: 
out: 
err: 
err: 
out: 
out: 
err: 
err: 
out: 
err: 
err: 
err: 
out: 
out: 
err: 
err: 
out: 
err: 
out: 
err: 
err: 
err: 
out: 
err: 
err: 
err: 
err: 
err: 
out: 
out: 
out: 
err: 
err: 
err: 
err: 
err: 
err: 
out: 
err: 
out: 
err: 
out: 
out: 
out: 
out: 
out: 
err: 
out: 
err: 
out: 
err: 
out: 
err: 
err: 
err: 
err: 
out: 
err: 
err: 
out: 
err: 
err: 
out: 
out: 
out: 
err: 
out: 
out: 
err: 
out: 
out: 
err: 
out: 
out: 
err: 
err: 
out: 
out: 
out: 
out: 
err: 
out: 
err: 
out: 
err: 
out: 
err: 
err: 
err: 
err: 
out: 
out: 
err: 
out: 
err: 
err: 
err: 
out: 
out: 
out: 
err: 
err: 
out: 
err: 
err: 
err: 
err: 
out: 
err: 
out: 
err: 
out: 
err: 
err: 
err: 
out: 
err: 
out: 
err: 
out: 
err: 
err: 
out: 
err: 
out: 
err: 
out: 
err: 
err: 
out: 
out: 
err: 
err: 
out: 
out: 
err: 
out: 
out: 
out: 
out: 
out: 
err: 
out: 
out: 
err: 
err: 
out: 
out: 
out: 
out: 
out: 
err: 
out: 
err: 
out: 
out: 
err: 
out: 
err: 
out: 
out: 
out: 
out: 
out: 
err: 
out: 
err: 
out: 
err: 
err: 
err: 
err: 
err: 
err: 
out: 
out: 
err: 
err: 
out: 
err: 
err: 
out: 
out: 
err: 
out: 
err: 
out: 
err: 
err: 
err: 
out: 
out: 
err: 
out: 
out: 
err: 
err: 
out: 
err: 
err: 
out: 
err: 
out: 
err: 
err: 
err: 
out: 
out: 
out: 
err: 
out: 
==============================================
✅ Successfully executed commands to all host.
==============================================
0s
Cleaning up orphan processes