Deploy ViWorks to DigitalOcean
 
Fix backend agent deployment: resolve container path conflicts and im… #9
Jobs
Run details
Annotations
1 error
Upload and execute deployment script
Process completed with exit code 1.
deploy
failed 1 minute ago in 29s

0s
3s
1s
2s
0s
4s
16s
Run scp -i ~/.ssh/id_ed25519 deploy.sh ${DROPLET_USER}@${DROPLET_IP}:/tmp/
🚀 Starting ViWorks Automated Deployment...
📅 Deployment started at: Fri Sep  5 15:42:59 UTC 2025
🛑 Stopping all containers gracefully...
 Container viworks-frontend  Stopping
 Container viworks-website  Stopping
 Container viworks-website  Stopped
 Container viworks-website  Removing
 Container viworks-frontend  Stopped
 Container viworks-frontend  Removing
 Container viworks-frontend  Removed
 Container viworks-backend  Stopping
 Container viworks-website  Removed
 Container viworks-backend  Stopped
 Container viworks-backend  Removing
 Container viworks-backend  Removed
 Container viworks-postgres  Stopping
 Container viworks-redis  Stopping
 Container viworks-postgres  Stopped
 Container viworks-postgres  Removing
 Container viworks-redis  Stopped
 Container viworks-redis  Removing
 Container viworks-postgres  Removed
 Container viworks-redis  Removed
🛑 Force stopping any running containers...
🧹 Removing containers with specific names...
🧹 Removing orphaned containers...
time="2025-09-05T15:42:59Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
🧹 Cleaning up Docker images...
Total reclaimed space: 0B
Deleted Images:
untagged: redis:7-alpine
untagged: redis@sha256:bb186d083732f669da90be8b0f975a37812b15e913465bb14d845db72a4e3e08
deleted: sha256:f218e591b571a4129aa29a8566b597d849fba21af7be853d31b03122b20db5e9
deleted: sha256:95e3321f9f5cf56aabd467800263973befbf989bd3a7187c9f258e1b6c0e774b
deleted: sha256:f6898ecdb40f8c6e3df474fee1d1511bae045f3a89ff9ad7656ae699acad5290
deleted: sha256:2480352bfda6d5d71cdeb8e67dfa30681807c2a470cb43939ae9014b19e002b9
deleted: sha256:79406017d11b4c1868c06dd58cf036dd07699e34c40d43a8f5f9d5efc47da240
deleted: sha256:091df48dc7a9fed806ce7ef7db4304e8deed6fedabb7734e186fd920b4e40de1
deleted: sha256:c356f1b78e583786c442a5fcebec800ca64dd3af339ceab3c9f941c11d55a732
deleted: sha256:aef83d7bea6a35e93d57850d9a988acae9724051de7ac1b68a564ea14d83a7fd
deleted: sha256:7003d23cc2176ec98ba2f8b3b4b9b5f144ef370e39bfcf6275a92b5064bc9261
untagged: postgres:15-alpine
untagged: postgres@sha256:987b242173006d6df08506f10b967a71478a3610664cfefbc49b9c775d3d0eed
deleted: sha256:06686173a6ebc27c0f4687565ae0fe73342ea23d1e3813264ded5f5d2b29fe28
deleted: sha256:264f7f5f551dc12be6f85bc29d527184423bdd3c5f65e7d9d446f386f6efa458
deleted: sha256:f4aa82de3eb9ecb6545dd27b40cd2eaa1d5f010679d7a64af8070a4c6553390f
deleted: sha256:18008bb81456b8cee6c89805142a07f702eeb564d9f3484cb7f22b4865c83921
deleted: sha256:33772373e789c029710c6f6191d13cea0cd2a0453de75c695032478960503ab2
deleted: sha256:73159309ee2d2d19b9d757e7293e0002d4dddc37cdf3b444cb6a4bb203c2417a
deleted: sha256:bddc7474edf436301e2626f9ed79de2af4268708adc6e755f1d70929bb335d8c
deleted: sha256:4cb55432ebc805cefc072a9bfffb33a0932ea66341c9edf41c97b60f4b3cddaf
deleted: sha256:bf26df7b3dc388c4a595e50a71c26c3926af0501e9334eef9893ae6bcb665677
deleted: sha256:944ea8f7d73fecf15702dd1fac7450c10a2624e650ee33dcaff61f0116011fba
deleted: sha256:c30dbae2cf9d68684eacc09c10f84888e7562ef59e386b77e6694bc8646fe76f
untagged: digitaloceandocker-frontend:latest
deleted: sha256:3cd1c41a53408ceb377d651a41a81cfe22f7a1618b5f0374bd9fd8ec17087863
untagged: digitaloceandocker-website:latest
deleted: sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a
untagged: digitaloceandocker-backend:latest
deleted: sha256:a92ffc6cb943885a2e85a622bb8f6296115b3315dea8541a8eae659ef2b35f0a

Total reclaimed space: 306.8MB
🧹 Cleaning up unused networks...
🔍 Verifying no conflicting containers exist...
🔗 Updating repository remote to new location...
🔑 Testing SSH connection to GitHub...
Hi shaiannazari! You've successfully authenticated, but GitHub does not provide shell access.
SSH test completed (expected to fail with exit code 1)
🧹 Cleaning up and resetting git repository...
From github.com:shaiannazari/viworksolution
   6611e0b..aa57904  main       -> origin/main
HEAD is now at aa57904 Fix backend agent deployment: resolve container path conflicts and improve error handling
🌐 Setting up two-network security architecture...
Network viworks-public already exists
Network viworks-internal already exists
🔨 Building and starting new containers with two-network security...
 postgres Pulling 
 redis Pulling 
 0368fd46e3c6 Pulling fs layer 
 4c55286bbede Pulling fs layer 
 5e28347af205 Pulling fs layer 
 311eca34042e Pulling fs layer 
 e6fe6f07e192 Pulling fs layer 
 a2cadbfeca72 Pulling fs layer 
 4f4fb700ef54 Pulling fs layer 
 a976ed7e7808 Pulling fs layer 
 e6fe6f07e192 Waiting 
 a2cadbfeca72 Waiting 
 4f4fb700ef54 Waiting 
 a976ed7e7808 Waiting 
 311eca34042e Waiting 
 9824c27679d3 Already exists 
 61a7421693bd Pulling fs layer 
 51a939567803 Pulling fs layer 
 a612d38c9b48 Pulling fs layer 
 901a9540064a Pulling fs layer 
 6c13c55b4b82 Pulling fs layer 
 0f940631c13f Pulling fs layer 
 a15854d6fd91 Pulling fs layer 
 685be96195b7 Pulling fs layer 
 ce414b3fa674 Pulling fs layer 
 6afcd9ec0fd9 Pulling fs layer 
 a612d38c9b48 Waiting 
 901a9540064a Waiting 
 6c13c55b4b82 Waiting 
 0f940631c13f Waiting 
 a15854d6fd91 Waiting 
 685be96195b7 Waiting 
 ce414b3fa674 Waiting 
 6afcd9ec0fd9 Waiting 
 61a7421693bd Waiting 
 51a939567803 Waiting 
 5e28347af205 Downloading [>                                                  ]  2.416kB/173.2kB
 5e28347af205 Verifying Checksum 
 5e28347af205 Download complete 
 4c55286bbede Downloading [==================================================>]     950B/950B
 4c55286bbede Verifying Checksum 
 4c55286bbede Download complete 
 0368fd46e3c6 Downloading [>                                                  ]  36.88kB/3.638MB
 0368fd46e3c6 Verifying Checksum 
 0368fd46e3c6 Download complete 
 0368fd46e3c6 Extracting [>                                                  ]  65.54kB/3.638MB
 0368fd46e3c6 Extracting [=============================>                     ]  2.163MB/3.638MB
 0368fd46e3c6 Extracting [==================================================>]  3.638MB/3.638MB
 0368fd46e3c6 Pull complete 
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Pull complete 
 5e28347af205 Extracting [=========>                                         ]  32.77kB/173.2kB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 311eca34042e Downloading [>                                                  ]  10.95kB/1.003MB
 e6fe6f07e192 Downloading [>                                                  ]  127.5kB/12.41MB
 311eca34042e Verifying Checksum 
 311eca34042e Download complete 
 a2cadbfeca72 Downloading [==================================================>]      99B/99B
 a2cadbfeca72 Verifying Checksum 
 a2cadbfeca72 Download complete 
 5e28347af205 Pull complete 
 311eca34042e Extracting [=>                                                 ]  32.77kB/1.003MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 e6fe6f07e192 Downloading [============>                                      ]  3.015MB/12.41MB
 311eca34042e Pull complete 
 e6fe6f07e192 Downloading [================================>                  ]  7.991MB/12.41MB
 e6fe6f07e192 Downloading [=================================================> ]  12.22MB/12.41MB
 e6fe6f07e192 Verifying Checksum 
 e6fe6f07e192 Download complete 
 e6fe6f07e192 Extracting [>                                                  ]  131.1kB/12.41MB
 4f4fb700ef54 Downloading [==================================================>]      32B/32B
 4f4fb700ef54 Verifying Checksum 
 4f4fb700ef54 Download complete 
 e6fe6f07e192 Extracting [==========>                                        ]   2.49MB/12.41MB
 a976ed7e7808 Downloading [==================================================>]     574B/574B
 a976ed7e7808 Verifying Checksum 
 a976ed7e7808 Download complete 
 e6fe6f07e192 Extracting [=======================>                           ]  5.898MB/12.41MB
 e6fe6f07e192 Extracting [====================================>              ]  9.175MB/12.41MB
 e6fe6f07e192 Extracting [==================================================>]  12.41MB/12.41MB
 e6fe6f07e192 Pull complete 
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 51a939567803 Downloading [>                                                  ]  12.32kB/1.116MB
 51a939567803 Verifying Checksum 
 51a939567803 Download complete 
 a2cadbfeca72 Pull complete 
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 61a7421693bd Downloading [==================================================>]     969B/969B
 61a7421693bd Verifying Checksum 
 61a7421693bd Download complete 
 61a7421693bd Extracting [==================================================>]     969B/969B
 61a7421693bd Extracting [==================================================>]     969B/969B
 4f4fb700ef54 Pull complete 
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 61a7421693bd Pull complete 
 51a939567803 Extracting [=>                                                 ]  32.77kB/1.116MB
 a976ed7e7808 Pull complete 
 redis Pulled 
 51a939567803 Extracting [==================================================>]  1.116MB/1.116MB
 51a939567803 Pull complete 
 a612d38c9b48 Downloading [==================================================>]     175B/175B
 a612d38c9b48 Verifying Checksum 
 a612d38c9b48 Download complete 
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 a612d38c9b48 Pull complete 
 901a9540064a Downloading [==================================================>]     116B/116B
 901a9540064a Verifying Checksum 
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Pull complete 
 6c13c55b4b82 Downloading [>                                                  ]  536.6kB/103.9MB
 6c13c55b4b82 Downloading [====>                                              ]  9.613MB/103.9MB
 0f940631c13f Downloading [=======>                                           ]  1.369kB/9.448kB
 0f940631c13f Downloading [==================================================>]  9.448kB/9.448kB
 0f940631c13f Verifying Checksum 
 0f940631c13f Download complete 
 6c13c55b4b82 Downloading [=======>                                           ]  16.54MB/103.9MB
 6c13c55b4b82 Downloading [===========>                                       ]  22.95MB/103.9MB
 a15854d6fd91 Downloading [==================================================>]     129B/129B
 a15854d6fd91 Verifying Checksum 
 a15854d6fd91 Download complete 
 6c13c55b4b82 Downloading [=============>                                     ]  27.77MB/103.9MB
 6c13c55b4b82 Downloading [===============>                                   ]  32.57MB/103.9MB
 685be96195b7 Downloading [==================================================>]     171B/171B
 685be96195b7 Verifying Checksum 
 685be96195b7 Download complete 
 6c13c55b4b82 Downloading [=================>                                 ]  36.86MB/103.9MB
 6c13c55b4b82 Downloading [=====================>                             ]  44.86MB/103.9MB
 ce414b3fa674 Downloading [===========>                                       ]  1.369kB/5.927kB
 ce414b3fa674 Downloading [==================================================>]  5.927kB/5.927kB
 ce414b3fa674 Verifying Checksum 
 ce414b3fa674 Download complete 
 6c13c55b4b82 Downloading [========================>                          ]  50.19MB/103.9MB
 6c13c55b4b82 Downloading [==========================>                        ]  55.01MB/103.9MB
 6afcd9ec0fd9 Downloading [==================================================>]     185B/185B
 6afcd9ec0fd9 Verifying Checksum 
 6afcd9ec0fd9 Download complete 
 6c13c55b4b82 Downloading [============================>                      ]  59.29MB/103.9MB
 6c13c55b4b82 Downloading [==============================>                    ]  62.51MB/103.9MB
 6c13c55b4b82 Downloading [===============================>                   ]  66.26MB/103.9MB
 6c13c55b4b82 Downloading [=================================>                 ]     70MB/103.9MB
 6c13c55b4b82 Downloading [===================================>               ]   74.3MB/103.9MB
 6c13c55b4b82 Downloading [=======================================>           ]  82.35MB/103.9MB
 6c13c55b4b82 Downloading [===========================================>       ]  89.86MB/103.9MB
 6c13c55b4b82 Downloading [==============================================>    ]  96.26MB/103.9MB
 6c13c55b4b82 Downloading [================================================>  ]  101.6MB/103.9MB
 6c13c55b4b82 Verifying Checksum 
 6c13c55b4b82 Download complete 
 6c13c55b4b82 Extracting [>                                                  ]  557.1kB/103.9MB
 6c13c55b4b82 Extracting [=>                                                 ]  2.228MB/103.9MB
 6c13c55b4b82 Extracting [==>                                                ]  5.571MB/103.9MB
 6c13c55b4b82 Extracting [====>                                              ]   9.47MB/103.9MB
 6c13c55b4b82 Extracting [======>                                            ]  13.93MB/103.9MB
 6c13c55b4b82 Extracting [========>                                          ]  18.38MB/103.9MB
 6c13c55b4b82 Extracting [==========>                                        ]  22.84MB/103.9MB
 6c13c55b4b82 Extracting [=============>                                     ]   27.3MB/103.9MB
 6c13c55b4b82 Extracting [===============>                                   ]   31.2MB/103.9MB
 6c13c55b4b82 Extracting [=================>                                 ]  35.65MB/103.9MB
 6c13c55b4b82 Extracting [===================>                               ]  39.55MB/103.9MB
 6c13c55b4b82 Extracting [====================>                              ]  42.89MB/103.9MB
 6c13c55b4b82 Extracting [======================>                            ]  46.79MB/103.9MB
 6c13c55b4b82 Extracting [========================>                          ]  50.14MB/103.9MB
 6c13c55b4b82 Extracting [========================>                          ]  51.25MB/103.9MB
 6c13c55b4b82 Extracting [=========================>                         ]  52.92MB/103.9MB
 6c13c55b4b82 Extracting [==========================>                        ]  55.71MB/103.9MB
 6c13c55b4b82 Extracting [============================>                      ]  59.05MB/103.9MB
 6c13c55b4b82 Extracting [=============================>                     ]  61.83MB/103.9MB
 6c13c55b4b82 Extracting [===============================>                   ]  65.18MB/103.9MB
 6c13c55b4b82 Extracting [================================>                  ]  68.52MB/103.9MB
 6c13c55b4b82 Extracting [==================================>                ]  72.42MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.65MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]  75.76MB/103.9MB
 6c13c55b4b82 Extracting [=====================================>             ]  77.99MB/103.9MB
 6c13c55b4b82 Extracting [======================================>            ]  80.77MB/103.9MB
 6c13c55b4b82 Extracting [========================================>          ]  83.56MB/103.9MB
 6c13c55b4b82 Extracting [==========================================>        ]  87.46MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]  90.24MB/103.9MB
 6c13c55b4b82 Extracting [============================================>      ]  92.47MB/103.9MB
 6c13c55b4b82 Extracting [==============================================>    ]  96.93MB/103.9MB
 6c13c55b4b82 Extracting [================================================>  ]  100.8MB/103.9MB
 6c13c55b4b82 Extracting [==================================================>]  103.9MB/103.9MB
 6c13c55b4b82 Pull complete 
 0f940631c13f Extracting [==================================================>]  9.448kB/9.448kB
 0f940631c13f Extracting [==================================================>]  9.448kB/9.448kB
 0f940631c13f Pull complete 
 a15854d6fd91 Extracting [==================================================>]     129B/129B
 a15854d6fd91 Extracting [==================================================>]     129B/129B
 a15854d6fd91 Pull complete 
 685be96195b7 Extracting [==================================================>]     171B/171B
 685be96195b7 Extracting [==================================================>]     171B/171B
 685be96195b7 Pull complete 
 ce414b3fa674 Extracting [==================================================>]  5.927kB/5.927kB
 ce414b3fa674 Extracting [==================================================>]  5.927kB/5.927kB
 ce414b3fa674 Pull complete 
 6afcd9ec0fd9 Extracting [==================================================>]     185B/185B
 6afcd9ec0fd9 Extracting [==================================================>]     185B/185B
 6afcd9ec0fd9 Pull complete 
 postgres Pulled 
#1 [internal] load local bake definitions
#1 reading from stdin 1.49kB done
#1 DONE 0.0s

#2 [frontend internal] load build definition from Dockerfile
#2 transferring dockerfile: 1.58kB done
#2 DONE 0.0s

#3 [backend internal] load build definition from Dockerfile.fixed
#3 transferring dockerfile: 1.87kB done
#3 WARN: FromAsCasing: 'as' and 'FROM' keywords' casing do not match (line 2)
#3 DONE 0.0s

#4 [website internal] load build definition from Dockerfile
#4 transferring dockerfile: 2.04kB done
#4 DONE 0.0s

#5 [website internal] load metadata for docker.io/library/node:18-alpine
#5 ...

#6 [frontend internal] load metadata for docker.io/library/node:22-alpine
#6 DONE 0.3s

#7 [frontend internal] load .dockerignore
#7 transferring context: 2B done
#7 DONE 0.0s

#8 [frontend builder 1/7] FROM docker.io/library/node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9
#8 DONE 0.0s

#9 [frontend internal] load build context
#9 transferring context: 5.92kB done
#9 DONE 0.0s

#10 [frontend builder 7/7] RUN echo "Starting build process..." &&     npm run build &&     echo "Build completed. Checking standalone output..." &&     ls -la .next/ &&     ls -la .next/standalone/ || echo "Standalone directory not found!" &&     echo "Build verification complete."
#10 CACHED

#11 [frontend builder 4/7] COPY package*.json ./
#11 CACHED

#12 [frontend runner 5/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#12 CACHED

#13 [frontend builder 2/7] WORKDIR /app
#13 CACHED

#14 [frontend runner 4/7] WORKDIR /app
#14 CACHED

#15 [frontend builder 5/7] RUN npm install
#15 CACHED

#16 [frontend builder 3/7] RUN apk add --no-cache python3 make g++
#16 CACHED

#17 [frontend runner 2/7] RUN apk add --no-cache dumb-init
#17 CACHED

#18 [frontend runner 3/7] RUN addgroup -g 1001 -S nodejs &&     adduser -u 1001 -S nextjs -G nodejs
#18 CACHED

#19 [frontend runner 6/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#19 CACHED

#20 [frontend builder 6/7] COPY . .
#20 CACHED

#21 [frontend runner 7/7] RUN mkdir -p ./public
#21 CACHED

#22 [backend internal] load metadata for docker.io/library/rust:1.89.0-alpine
#22 DONE 0.3s

#23 [backend internal] load metadata for docker.io/library/alpine:3.22
#23 DONE 0.4s

#24 [frontend] exporting to image
#24 exporting layers done
#24 writing image sha256:3cd1c41a53408ceb377d651a41a81cfe22f7a1618b5f0374bd9fd8ec17087863 done
#24 naming to docker.io/library/digitaloceandocker-frontend done
#24 DONE 0.0s

#25 [backend internal] load .dockerignore
#25 transferring context: 2B done
#25 DONE 0.0s

#5 [website internal] load metadata for docker.io/library/node:18-alpine
#5 DONE 0.4s

#26 [backend builder  1/11] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#26 DONE 0.0s

#27 [backend stage-1 1/7] FROM docker.io/library/alpine:3.22@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#27 DONE 0.0s

#28 [backend internal] load build context
#28 transferring context: 1.73kB done
#28 DONE 0.0s

#29 [website internal] load .dockerignore
#29 transferring context: 2B done
#29 DONE 0.0s

#30 [frontend] resolving provenance for metadata file
#30 DONE 0.0s

#31 [website base 1/1] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#31 DONE 0.0s

#32 [backend stage-1 2/7] RUN apk add --no-cache     ca-certificates     dumb-init     busybox-extras     netcat-openbsd     wget     curl     tzdata     bash     postgresql-client     redis
#32 CACHED

#33 [backend stage-1 6/7] COPY ops/entrypoint.sh /app/entrypoint.sh
#33 CACHED

#34 [backend stage-1 3/7] WORKDIR /app
#34 CACHED

#35 [backend builder  5/11] COPY Cargo.toml Cargo.lock* ./
#35 CACHED

#36 [backend builder  8/11] RUN rm src/main.rs
#36 CACHED

#37 [backend builder  6/11] RUN mkdir src && echo "fn main() {}" > src/main.rs
#37 CACHED

#38 [backend builder  3/11] RUN apk add --no-cache     pkgconfig     openssl-dev     postgresql-dev     musl-dev     gcc     curl
#38 CACHED

#39 [backend builder  4/11] RUN rustup target add x86_64-unknown-linux-musl
#39 CACHED

#40 [backend builder  7/11] RUN cargo build --release
#40 CACHED

#41 [backend builder  9/11] COPY src ./src
#41 CACHED

#42 [backend builder 10/11] COPY migrations ./migrations
#42 CACHED

#43 [backend builder 11/11] RUN cargo build --release
#43 CACHED

#44 [backend stage-1 4/7] COPY --from=builder /app/target/release/viworks-admin-backend /app/app
#44 CACHED

#45 [backend stage-1 5/7] COPY --from=builder /app/migrations /app/migrations
#45 CACHED

#46 [backend builder  2/11] WORKDIR /app
#46 CACHED

#47 [backend stage-1 7/7] RUN adduser -D -u 10001 appuser &&     chown -R appuser:appuser /app &&     chmod +x /app/entrypoint.sh
#47 CACHED

#48 [website internal] load build context
#48 transferring context: 7.37kB 0.0s done
#48 DONE 0.0s

#49 [backend] exporting to image
#49 exporting layers done
#49 writing image sha256:a92ffc6cb943885a2e85a622bb8f6296115b3315dea8541a8eae659ef2b35f0a done
#49 naming to docker.io/library/digitaloceandocker-backend done
#49 DONE 0.0s

#50 [website runner 7/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#50 CACHED

#51 [website runner 5/8] RUN mkdir .next
#51 CACHED

#52 [website builder 2/5] COPY --from=deps /app/node_modules ./node_modules
#52 CACHED

#53 [website deps 1/4] RUN apk add --no-cache libc6-compat
#53 CACHED

#54 [website deps 3/4] COPY package.json pnpm-lock.yaml* ./
#54 CACHED

#55 [website runner 3/8] RUN adduser --system --uid 1001 nextjs
#55 CACHED

#56 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#56 CACHED

#57 [website builder 3/5] COPY . .
#57 CACHED

#58 [website runner 6/8] RUN chown nextjs:nodejs .next
#58 CACHED

#59 [website runner 4/8] COPY --from=builder /app/public ./public
#59 CACHED

#60 [website builder 1/5] WORKDIR /app
#60 CACHED

#61 [website deps 2/4] WORKDIR /app
#61 CACHED

#62 [website builder 4/5] RUN mkdir -p public
#62 CACHED

#63 [website runner 2/8] RUN addgroup --system --gid 1001 nodejs
#63 CACHED

#64 [website builder 5/5] RUN npm run build
#64 CACHED

#65 [website runner 8/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#65 CACHED

#66 [website] exporting to image
#66 exporting layers done
#66 writing image sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a done
#66 naming to docker.io/library/digitaloceandocker-website done
#66 DONE 0.0s

#67 [backend] resolving provenance for metadata file
#67 DONE 0.0s
 digitaloceandocker-backend  Built

#68 [website] resolving provenance for metadata file
#68 DONE 0.0s
 digitaloceandocker-frontend  Built
 digitaloceandocker-website  Built
 Container viworks-website  Creating
 Container viworks-postgres  Creating
 Container viworks-redis  Creating
 Container viworks-redis  Created
 Container viworks-postgres  Created
 Container viworks-backend  Creating
 Container viworks-website  Created
 Container viworks-backend  Created
 Container viworks-frontend  Creating
 Container viworks-frontend  Created
 Container viworks-nginx  Creating
 Container viworks-nginx  Error response from daemon: Conflict. The container name "/viworks-nginx" is already in use by container "31d53f40df00f5b53a4a2e7ffc487a2d6feaec569450db50e3c423d3b6a462f3". You have to remove (or rename) that container to be able to reuse that name.
Error response from daemon: Conflict. The container name "/viworks-nginx" is already in use by container "31d53f40df00f5b53a4a2e7ffc487a2d6feaec569450db50e3c423d3b6a462f3". You have to remove (or rename) that container to be able to reuse that name.
Error: Process completed with exit code 1.
0s
1s
