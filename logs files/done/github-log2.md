deploy
failed 1 minute ago in 11m 17s

0s
2s
2s
Run mkdir -p ~/.ssh
# ***:22 SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.13
# ***:22 SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.13
# ***:22 SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.13
# ***:22 SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.13
# ***:22 SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.13
2s
Run ssh -o ConnectTimeout=10 -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "echo 'SSH connection test successful'"
SSH connection test successful
0s
11m 7s
Run scp -i ~/.ssh/id_ed25519 deploy.sh ${DROPLET_USER}@${DROPLET_IP}:/tmp/
🚀 Starting ViWorks Automated Deployment...
📅 Deployment started at: Tue Sep  2 01:08:41 UTC 2025
🛑 Stopping all containers gracefully...
 Container viworks-nginx  Stopping
 Container viworks-frontend  Stopping
 Container viworks-website  Stopping
 Container viworks-agent  Stopping
 Container viworks-nginx  Stopped
 Container viworks-nginx  Removing
 Container viworks-agent  Stopped
 Container viworks-agent  Removing
 Container viworks-nginx  Removed
 Container viworks-agent  Removed
 Container viworks-frontend  Stopped
 Container viworks-frontend  Removing
 Container viworks-frontend  Removed
 Container viworks-backend  Stopping
 Container viworks-backend  Stopped
 Container viworks-backend  Removing
 Container viworks-backend  Removed
 Container viworks-redis  Stopping
 Container viworks-postgres  Stopping
 Container viworks-website  Stopped
 Container viworks-website  Removing
 Container viworks-website  Removed
 Container viworks-postgres  Stopped
 Container viworks-postgres  Removing
 Container viworks-postgres  Removed
 Container viworks-redis  Stopped
 Container viworks-redis  Removing
 Container viworks-redis  Removed
🛑 Force stopping any running containers...
🧹 Removing containers with specific names...
🧹 Removing orphaned containers...
time="2025-09-02T01:08:42Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
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
untagged: digitaloceandocker-website:latest
deleted: sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a
untagged: digitaloceandocker-backend:latest
deleted: sha256:8888480f7640cc0bce6fc686cd0b4b0ea6b93e1ce3e73c4377e541bbcc8964d2
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
deleted: sha256:5df242396420b99f980135e561ed081c939e3a76f937599d1f50f5dd9ca28d95
untagged: nginx:alpine
untagged: nginx@sha256:42a516af16b852e33b7682d5ef8acbd5d13fe08fecadc7ed98605ba5e3b26ab8
deleted: sha256:4a86014ec6994761b7f3118cf47e4b4fd6bac15fc6fa262c4f356386bbc0e9d9
deleted: sha256:8467261c7f0e4397ee8d337ef10d8648c121fe2f619a2e5cafdeebe245fcbb3b
deleted: sha256:c33556087f4158ec30235c241cacf447741bd28a8e2e3fced91670fcc8ad5678
deleted: sha256:526df50674c343160c450c171f61d48f7937b8985be6ae4f363d95dcbf15909b
deleted: sha256:d634a1f24dd647a1ccbcf4f44420fe25643698203d481f3ce9d5d22cca265678
deleted: sha256:77e27df03d7d33aec8046089ab12096952dd8469d32e1b120408111286a2ba9e
deleted: sha256:a40539bc91549269b20f030f31b43cea85143f167c870cd7eb7c231ecfbcf9b0
deleted: sha256:db935a97efccea40a8e81864140a14283aba386edc2ca273553a9ea74df34235
untagged: digitaloceandocker-agent:latest
deleted: sha256:c72f3fb0a5146067e1440591134c67a46d7757775718b8a075a1596f8457d136
Total reclaimed space: 351MB
🧹 Cleaning up unused networks...
Deleted Networks:
viworks-public
viworks-internal
🔍 Verifying no conflicting containers exist...
🧹 Cleaning up and resetting git repository...
From https://github.com/apebrahimi/viworkdemo002
   bb89d79..fef53b7  main       -> origin/main
HEAD is now at fef53b7 🚀 COMPREHENSIVE PLATFORM IMPROVEMENTS - Enhanced resilience, monitoring, and maintainability
🌐 Setting up two-network security architecture...
8e55f77df7d5c851acb57bb8d4d84570b46ab7ed4e891b808a1e1ca04592db33
b5395c64341f3222bdb7d768d44d163d8df3a210fd3bf1e526916515cde63aeb
🔨 Building and starting new containers with two-network security...
 redis Pulling 
 nginx Pulling 
 postgres Pulling 
 9824c27679d3 Already exists 
 6bc572a340ec Pulling fs layer 
 403e3f251637 Pulling fs layer 
 9adfbae99cb7 Pulling fs layer 
 7a8a46741e18 Pulling fs layer 
 c9ebe2ff2d2c Pulling fs layer 
 a992fbc61ecc Pulling fs layer 
 cb1ff4086f82 Pulling fs layer 
 7a8a46741e18 Waiting 
 c9ebe2ff2d2c Waiting 
 a992fbc61ecc Waiting 
 cb1ff4086f82 Waiting 
 0368fd46e3c6 Pulling fs layer 
 4c55286bbede Pulling fs layer 
 5e28347af205 Pulling fs layer 
 311eca34042e Pulling fs layer 
 e6fe6f07e192 Pulling fs layer 
 a2cadbfeca72 Pulling fs layer 
 4f4fb700ef54 Pulling fs layer 
 a976ed7e7808 Pulling fs layer 
 0368fd46e3c6 Waiting 
 4c55286bbede Waiting 
 5e28347af205 Waiting 
 311eca34042e Waiting 
 e6fe6f07e192 Waiting 
 a2cadbfeca72 Waiting 
 4f4fb700ef54 Waiting 
 a976ed7e7808 Waiting 
 9824c27679d3 Already exists 
 61a7421693bd Pulling fs layer 
 51a939567803 Pulling fs layer 
 a612d38c9b48 Pulling fs layer 
 901a9540064a Pulling fs layer 
 6c13c55b4b82 Pulling fs layer 
 0f940631c13f Pulling fs layer 
 61a7421693bd Waiting 
 51a939567803 Waiting 
 a15854d6fd91 Pulling fs layer 
 685be96195b7 Pulling fs layer 
 ce414b3fa674 Pulling fs layer 
 6afcd9ec0fd9 Pulling fs layer 
 6c13c55b4b82 Waiting 
 0f940631c13f Waiting 
 a15854d6fd91 Waiting 
 685be96195b7 Waiting 
 ce414b3fa674 Waiting 
 6afcd9ec0fd9 Waiting 
 a612d38c9b48 Waiting 
 901a9540064a Waiting 
 403e3f251637 Downloading [==================================================>]     628B/628B
 403e3f251637 Verifying Checksum 
 403e3f251637 Download complete 
 9adfbae99cb7 Verifying Checksum 
 9adfbae99cb7 Download complete 
 6bc572a340ec Downloading [>                                                  ]  19.14kB/1.806MB
 6bc572a340ec Downloading [======================>                            ]  819.2kB/1.806MB
 7a8a46741e18 Downloading [==================================================>]     405B/405B
 7a8a46741e18 Verifying Checksum 
 7a8a46741e18 Download complete 
 c9ebe2ff2d2c Downloading [===========================================>       ]  1.049kB/1.209kB
 c9ebe2ff2d2c Downloading [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Download complete 
 6bc572a340ec Downloading [============================================>      ]  1.597MB/1.806MB
 6bc572a340ec Download complete 
 6bc572a340ec Extracting [>                                                  ]  32.77kB/1.806MB
 6bc572a340ec Extracting [==================================================>]  1.806MB/1.806MB
 6bc572a340ec Pull complete 
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Pull complete 
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Pull complete 
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 7a8a46741e18 Pull complete 
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 a992fbc61ecc Downloading [=====================================>             ]  1.049kB/1.398kB
 a992fbc61ecc Downloading [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Verifying Checksum 
 a992fbc61ecc Download complete 
 c9ebe2ff2d2c Pull complete 
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Pull complete 
 cb1ff4086f82 Downloading [>                                                  ]  172.2kB/16.84MB
 0368fd46e3c6 Downloading [>                                                  ]  36.88kB/3.638MB
 0368fd46e3c6 Verifying Checksum 
 0368fd46e3c6 Download complete 
 0368fd46e3c6 Extracting [>                                                  ]  65.54kB/3.638MB
 cb1ff4086f82 Downloading [====================>                              ]  6.853MB/16.84MB
 cb1ff4086f82 Downloading [====================================>              ]  12.32MB/16.84MB
 0368fd46e3c6 Extracting [==================>                                ]  1.376MB/3.638MB
 cb1ff4086f82 Verifying Checksum 
 cb1ff4086f82 Download complete 
 0368fd46e3c6 Extracting [======================================>            ]  2.818MB/3.638MB
 cb1ff4086f82 Extracting [>                                                  ]  196.6kB/16.84MB
 0368fd46e3c6 Extracting [==================================================>]  3.638MB/3.638MB
 4c55286bbede Downloading [==================================================>]     950B/950B
 4c55286bbede Verifying Checksum 
 4c55286bbede Download complete 
 0368fd46e3c6 Pull complete 
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Extracting [==================================================>]     950B/950B
 cb1ff4086f82 Extracting [=>                                                 ]  393.2kB/16.84MB
 4c55286bbede Pull complete 
 5e28347af205 Downloading [>                                                  ]  2.738kB/173.2kB
 5e28347af205 Verifying Checksum 
 5e28347af205 Download complete 
 5e28347af205 Extracting [=========>                                         ]  32.77kB/173.2kB
 cb1ff4086f82 Extracting [=========>                                         ]  3.146MB/16.84MB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 cb1ff4086f82 Extracting [============>                                      ]  4.325MB/16.84MB
 311eca34042e Downloading [>                                                  ]  10.95kB/1.003MB
 cb1ff4086f82 Extracting [=================>                                 ]  5.898MB/16.84MB
 311eca34042e Verifying Checksum 
 311eca34042e Download complete 
 5e28347af205 Pull complete 
 311eca34042e Extracting [=>                                                 ]  32.77kB/1.003MB
 cb1ff4086f82 Extracting [========================>                          ]  8.258MB/16.84MB
 e6fe6f07e192 Downloading [>                                                  ]    127kB/12.41MB
 311eca34042e Extracting [========================================>          ]  819.2kB/1.003MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 e6fe6f07e192 Downloading [===========================>                       ]  6.816MB/12.41MB
 311eca34042e Pull complete 
 cb1ff4086f82 Extracting [===========================>                       ]  9.241MB/16.84MB
 a2cadbfeca72 Downloading [==================================================>]      99B/99B
 a2cadbfeca72 Verifying Checksum 
 a2cadbfeca72 Download complete 
 e6fe6f07e192 Verifying Checksum 
 e6fe6f07e192 Download complete 
 e6fe6f07e192 Extracting [>                                                  ]  131.1kB/12.41MB
 cb1ff4086f82 Extracting [================================>                  ]  10.81MB/16.84MB
 e6fe6f07e192 Extracting [===>                                               ]  917.5kB/12.41MB
 cb1ff4086f82 Extracting [====================================>              ]  12.39MB/16.84MB
 e6fe6f07e192 Extracting [===========>                                       ]  2.884MB/12.41MB
 4f4fb700ef54 Downloading [==================================================>]      32B/32B
 4f4fb700ef54 Verifying Checksum 
 4f4fb700ef54 Download complete 
 cb1ff4086f82 Extracting [=========================================>         ]  13.96MB/16.84MB
 e6fe6f07e192 Extracting [====================>                              ]  5.112MB/12.41MB
 cb1ff4086f82 Extracting [================================================>  ]  16.32MB/16.84MB
 a976ed7e7808 Downloading [==================================================>]     574B/574B
 a976ed7e7808 Verifying Checksum 
 a976ed7e7808 Download complete 
 e6fe6f07e192 Extracting [================================>                  ]  8.126MB/12.41MB
 cb1ff4086f82 Extracting [==================================================>]  16.84MB/16.84MB
 61a7421693bd Downloading [==================================================>]     969B/969B
 61a7421693bd Verifying Checksum 
 61a7421693bd Download complete 
 61a7421693bd Extracting [==================================================>]     969B/969B
 61a7421693bd Extracting [==================================================>]     969B/969B
 e6fe6f07e192 Extracting [===========================================>       ]  10.75MB/12.41MB
 e6fe6f07e192 Extracting [==================================================>]  12.41MB/12.41MB
 cb1ff4086f82 Pull complete 
 61a7421693bd Pull complete 
 e6fe6f07e192 Pull complete 
 nginx Pulled 
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 51a939567803 Downloading [>                                                  ]  12.32kB/1.116MB
 a2cadbfeca72 Pull complete 
 51a939567803 Verifying Checksum 
 51a939567803 Download complete 
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 51a939567803 Extracting [=>                                                 ]  32.77kB/1.116MB
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Pull complete 
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 51a939567803 Extracting [==================================================>]  1.116MB/1.116MB
 51a939567803 Pull complete 
 a976ed7e7808 Pull complete 
 redis Pulled 
 a612d38c9b48 Downloading [==================================================>]     175B/175B
 a612d38c9b48 Verifying Checksum 
 a612d38c9b48 Download complete 
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 a612d38c9b48 Pull complete 
 901a9540064a Downloading [==================================================>]     116B/116B
 901a9540064a Verifying Checksum 
 901a9540064a Download complete 
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Pull complete 
 6c13c55b4b82 Downloading [>                                                  ]  540.7kB/103.9MB
 6c13c55b4b82 Downloading [===>                                               ]  7.471MB/103.9MB
 0f940631c13f Downloading [=======>                                           ]  1.369kB/9.448kB
 0f940631c13f Downloading [==================================================>]  9.448kB/9.448kB
 0f940631c13f Verifying Checksum 
 0f940631c13f Download complete 
 6c13c55b4b82 Downloading [=======>                                           ]   15.5MB/103.9MB
 a15854d6fd91 Downloading [==================================================>]     129B/129B
 a15854d6fd91 Verifying Checksum 
 a15854d6fd91 Download complete 
 6c13c55b4b82 Downloading [===========>                                       ]   23.5MB/103.9MB
 6c13c55b4b82 Downloading [=============>                                     ]  28.31MB/103.9MB
 685be96195b7 Downloading [==================================================>]     171B/171B
 685be96195b7 Verifying Checksum 
 685be96195b7 Download complete 
 6c13c55b4b82 Downloading [================>                                  ]  33.64MB/103.9MB
 ce414b3fa674 Downloading [========>                                          ]  1.049kB/5.927kB
 ce414b3fa674 Downloading [==================================================>]  5.927kB/5.927kB
 ce414b3fa674 Verifying Checksum 
 ce414b3fa674 Download complete 
 6c13c55b4b82 Downloading [===================>                               ]  40.03MB/103.9MB
 6c13c55b4b82 Downloading [=======================>                           ]     48MB/103.9MB
 6c13c55b4b82 Downloading [=========================>                         ]  52.81MB/103.9MB
 6c13c55b4b82 Downloading [===========================>                       ]  58.13MB/103.9MB
 6afcd9ec0fd9 Downloading [==================================================>]     185B/185B
 6afcd9ec0fd9 Verifying Checksum 
 6afcd9ec0fd9 Download complete 
 6c13c55b4b82 Downloading [===============================>                   ]  65.58MB/103.9MB
 6c13c55b4b82 Downloading [==================================>                ]  72.53MB/103.9MB
 6c13c55b4b82 Downloading [=====================================>             ]  78.92MB/103.9MB
 6c13c55b4b82 Downloading [========================================>          ]  84.24MB/103.9MB
 6c13c55b4b82 Downloading [===========================================>       ]  90.11MB/103.9MB
 6c13c55b4b82 Downloading [=============================================>     ]  95.41MB/103.9MB
 6c13c55b4b82 Downloading [================================================>  ]  101.8MB/103.9MB
 6c13c55b4b82 Verifying Checksum 
 6c13c55b4b82 Download complete 
 6c13c55b4b82 Extracting [>                                                  ]  557.1kB/103.9MB
 6c13c55b4b82 Extracting [=>                                                 ]  2.228MB/103.9MB
 6c13c55b4b82 Extracting [==>                                                ]  6.128MB/103.9MB
 6c13c55b4b82 Extracting [====>                                              ]   9.47MB/103.9MB
 6c13c55b4b82 Extracting [======>                                            ]  12.81MB/103.9MB
 6c13c55b4b82 Extracting [=======>                                           ]  16.15MB/103.9MB
 6c13c55b4b82 Extracting [=========>                                         ]  20.05MB/103.9MB
 6c13c55b4b82 Extracting [===========>                                       ]   23.4MB/103.9MB
 6c13c55b4b82 Extracting [============>                                      ]  26.74MB/103.9MB
 6c13c55b4b82 Extracting [==============>                                    ]  29.52MB/103.9MB
 6c13c55b4b82 Extracting [===============>                                   ]  32.31MB/103.9MB
 6c13c55b4b82 Extracting [================>                                  ]  35.09MB/103.9MB
 6c13c55b4b82 Extracting [==================>                                ]  38.44MB/103.9MB
 6c13c55b4b82 Extracting [====================>                              ]  41.78MB/103.9MB
 6c13c55b4b82 Extracting [=====================>                             ]  45.12MB/103.9MB
 6c13c55b4b82 Extracting [=======================>                           ]  47.91MB/103.9MB
 6c13c55b4b82 Extracting [========================>                          ]  50.14MB/103.9MB
 6c13c55b4b82 Extracting [========================>                          ]  51.81MB/103.9MB
 6c13c55b4b82 Extracting [=========================>                         ]  54.03MB/103.9MB
 6c13c55b4b82 Extracting [===========================>                       ]  56.82MB/103.9MB
 6c13c55b4b82 Extracting [=============================>                     ]  60.72MB/103.9MB
 6c13c55b4b82 Extracting [==============================>                    ]   63.5MB/103.9MB
 6c13c55b4b82 Extracting [================================>                  ]  66.85MB/103.9MB
 6c13c55b4b82 Extracting [=================================>                 ]  69.63MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  72.97MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.65MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]   75.2MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]  76.32MB/103.9MB
 6c13c55b4b82 Extracting [=====================================>             ]  77.99MB/103.9MB
 6c13c55b4b82 Extracting [======================================>            ]  80.22MB/103.9MB
 6c13c55b4b82 Extracting [=======================================>           ]  82.44MB/103.9MB
 6c13c55b4b82 Extracting [========================================>          ]  84.67MB/103.9MB
 6c13c55b4b82 Extracting [==========================================>        ]  88.01MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]   90.8MB/103.9MB
 6c13c55b4b82 Extracting [=============================================>     ]  95.26MB/103.9MB
 6c13c55b4b82 Extracting [===============================================>   ]  99.71MB/103.9MB
 6c13c55b4b82 Extracting [=================================================> ]  103.1MB/103.9MB
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
#1 reading from stdin 1.93kB done
#1 DONE 0.0s
#2 [agent internal] load build definition from Dockerfile.alpine-production
#2 transferring dockerfile: 1.79kB done
#2 WARN: FromAsCasing: 'as' and 'FROM' keywords' casing do not match (line 2)
#2 DONE 0.0s
#3 [backend internal] load build definition from Dockerfile.fixed
#3 transferring dockerfile: 1.87kB done
#3 WARN: FromAsCasing: 'as' and 'FROM' keywords' casing do not match (line 2)
#3 DONE 0.0s
#4 [frontend internal] load build definition from Dockerfile
#4 transferring dockerfile: 1.25kB done
#4 DONE 0.0s
#5 [website internal] load build definition from Dockerfile
#5 transferring dockerfile: 2.04kB done
#5 DONE 0.0s
#6 [agent internal] load metadata for docker.io/library/rust:1.89.0-alpine
#6 DONE 0.7s
#7 [backend internal] load metadata for docker.io/library/alpine:3.22
#7 DONE 0.8s
#8 [frontend internal] load metadata for docker.io/library/node:22-alpine
#8 DONE 0.8s
#9 [agent internal] load metadata for docker.io/library/alpine:latest
#9 DONE 0.8s
#10 [backend internal] load .dockerignore
#10 transferring context: 2B done
#10 DONE 0.0s
#11 [website internal] load metadata for docker.io/library/node:18-alpine
#11 DONE 0.8s
#12 [backend builder  1/11] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 DONE 0.0s
#13 [backend stage-1 1/7] FROM docker.io/library/alpine:3.22@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#13 DONE 0.0s
#14 [agent internal] load .dockerignore
#14 transferring context: 2B done
#14 DONE 0.0s
#15 [frontend internal] load .dockerignore
#15 transferring context: 2B done
#15 DONE 0.0s
#16 [website internal] load .dockerignore
#16 transferring context: 2B 0.0s done
#16 DONE 0.0s
#17 [backend internal] load build context
#17 transferring context: 33.40kB done
#17 DONE 0.0s
#12 [agent builder  1/11] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 DONE 0.0s
#13 [agent stage-1 1/7] FROM docker.io/library/alpine:3.22@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#13 DONE 0.0s
#18 [agent stage-1 1/9] FROM docker.io/library/alpine:latest@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#18 DONE 0.0s
#19 [frontend builder 1/6] FROM docker.io/library/node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9
#19 DONE 0.0s
#20 [website base 1/1] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#20 DONE 0.0s
#21 [agent internal] load build context
#21 transferring context: 496B 0.0s done
#21 DONE 0.0s
#22 [backend builder  2/11] WORKDIR /app
#22 CACHED
#23 [backend builder  3/11] RUN apk add --no-cache     pkgconfig     openssl-dev     postgresql-dev     musl-dev     gcc     curl
#23 CACHED
#24 [backend builder  4/11] RUN rustup target add x86_64-unknown-linux-musl
#24 CACHED
#25 [agent builder  5/10] RUN mkdir src && echo "fn main() {}" > src/main.rs
#25 CACHED
#26 [agent stage-1 6/9] COPY agent.toml /etc/viworks/
#26 CACHED
#27 [agent builder  2/10] RUN apk update && apk add --no-cache     build-base     pkgconfig     openssl-dev     musl-dev     ca-certificates     && rm -rf /var/cache/apk/*
#27 CACHED
#28 [agent stage-1 8/9] RUN chmod +x /usr/local/bin/viworks-gateway-agent
#28 CACHED
#29 [agent stage-1 7/9] RUN chown -R viworks:viworks /etc/viworks /var/log/viworks
#29 CACHED
#30 [agent stage-1 3/9] RUN addgroup -g 1000 viworks &&     adduser -D -s /bin/bash -u 1000 -G viworks viworks
#30 CACHED
#31 [agent builder  7/10] RUN rm src/main.rs
#31 CACHED
#32 [agent builder  8/10] COPY src/ ./src/
#32 CACHED
#33 [agent stage-1 5/9] COPY --from=builder /app/target/release/viworks-gateway-agent /usr/local/bin/
#33 CACHED
#34 [agent builder  4/10] COPY Cargo.toml Cargo.lock ./
#34 CACHED
#35 [agent builder  6/10] RUN cargo build --release
#35 CACHED
#36 [agent builder  9/10] RUN cargo build --release
#36 CACHED
#37 [agent stage-1 4/9] RUN mkdir -p /etc/viworks /var/log/viworks /usr/local/bin
#37 CACHED
#38 [agent stage-1 2/9] RUN apk update && apk add --no-cache     ca-certificates     libssl3     && rm -rf /var/cache/apk/*
#38 CACHED
#39 [agent builder 10/10] RUN strip target/release/viworks-gateway-agent
#39 CACHED
#40 [agent builder  3/10] WORKDIR /app
#40 CACHED
#41 [agent stage-1 9/9] RUN chmod 644 /etc/viworks/agent.toml
#41 CACHED
#42 [frontend internal] load build context
#42 transferring context: 5.42kB 0.0s done
#42 DONE 0.0s
#43 [frontend runner 2/7] RUN apk add --no-cache dumb-init
#43 CACHED
#44 [frontend builder 3/6] COPY package*.json ./
#44 CACHED
#45 [frontend builder 2/6] WORKDIR /app
#45 CACHED
#46 [frontend runner 4/7] WORKDIR /app
#46 CACHED
#47 [frontend runner 6/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#47 CACHED
#48 [frontend builder 6/6] RUN npm run build
#48 CACHED
#49 [frontend runner 5/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#49 CACHED
#50 [frontend builder 5/6] COPY . .
#50 CACHED
#51 [frontend builder 4/6] RUN npm install
#51 CACHED
#52 [frontend runner 3/7] RUN addgroup -g 1001 -S nodejs &&     adduser -u 1001 -S nextjs -G nodejs
#52 CACHED
#53 [frontend runner 7/7] RUN mkdir -p ./public
#53 CACHED
#54 [website internal] load build context
#54 transferring context: 7.37kB 0.0s done
#54 DONE 0.0s
#55 [agent] exporting to image
#55 exporting layers done
#55 writing image sha256:c72f3fb0a5146067e1440591134c67a46d7757775718b8a075a1596f8457d136 done
#55 naming to docker.io/library/digitaloceandocker-agent done
#55 DONE 0.0s
#56 [website deps 2/4] WORKDIR /app
#56 CACHED
#57 [website runner 4/8] COPY --from=builder /app/public ./public
#57 CACHED
#58 [website runner 6/8] RUN chown nextjs:nodejs .next
#58 CACHED
#59 [website deps 3/4] COPY package.json pnpm-lock.yaml* ./
#59 CACHED
#60 [website runner 3/8] RUN adduser --system --uid 1001 nextjs
#60 CACHED
#61 [website builder 5/5] RUN npm run build
#61 CACHED
#62 [website builder 3/5] COPY . .
#62 CACHED
#63 [website runner 2/8] RUN addgroup --system --gid 1001 nodejs
#63 CACHED
#64 [website runner 5/8] RUN mkdir .next
#64 CACHED
#65 [website builder 4/5] RUN mkdir -p public
#65 CACHED
#66 [website builder 1/5] WORKDIR /app
#66 CACHED
#67 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#67 CACHED
#68 [website deps 1/4] RUN apk add --no-cache libc6-compat
#68 CACHED
#69 [website runner 7/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#69 CACHED
#70 [website builder 2/5] COPY --from=deps /app/node_modules ./node_modules
#70 CACHED
#71 [website runner 8/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#71 CACHED
#72 [website] exporting to image
#72 exporting layers done
#72 writing image sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a
#72 writing image sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a 0.1s done
#72 naming to docker.io/library/digitaloceandocker-website
#72 naming to docker.io/library/digitaloceandocker-website 0.2s done
#72 ...
#73 [frontend] exporting to image
#73 exporting layers done
#73 writing image sha256:5df242396420b99f980135e561ed081c939e3a76f937599d1f50f5dd9ca28d95 0.1s done
#73 naming to docker.io/library/digitaloceandocker-frontend 0.1s done
#73 DONE 0.5s
#72 [website] exporting to image
#72 DONE 0.5s
#74 [backend builder  5/11] COPY Cargo.toml Cargo.lock* ./
#74 DONE 0.6s
#75 [agent] resolving provenance for metadata file
#75 DONE 0.0s
#76 [frontend] resolving provenance for metadata file
#76 DONE 0.0s
#77 [website] resolving provenance for metadata file
#77 DONE 0.0s
#78 [backend builder  6/11] RUN mkdir src && echo "fn main() {}" > src/main.rs
#78 DONE 0.3s
#79 [backend builder  7/11] RUN cargo build --release
#79 0.547     Updating crates.io index
#79 2.656  Downloading crates ...
#79 2.750   Downloaded actix-codec v0.5.2
#79 2.773   Downloaded actix-router v0.5.3
#79 2.818   Downloaded stringprep v0.1.5
#79 2.886   Downloaded matchers v0.2.0
#79 2.908   Downloaded num-iter v0.1.45
#79 2.924   Downloaded num-traits v0.2.19
#79 2.947   Downloaded icu_properties v2.0.1
#79 2.966   Downloaded rand_core v0.9.3
#79 2.983   Downloaded simple_asn1 v0.6.3
#79 2.994   Downloaded pem-rfc7468 v0.7.0
#79 3.004   Downloaded num-bigint v0.4.6
#79 3.015   Downloaded regex v1.11.2
#79 3.040   Downloaded redis v0.24.0
#79 3.060   Downloaded regex-lite v0.1.7
#79 3.066   Downloaded regex-automata v0.4.10
#79 3.099   Downloaded zerocopy v0.8.26
#79 3.153   Downloaded webpki-***s v1.0.2
#79 3.170   Downloaded vcpkg v0.2.15
#79 3.282   Downloaded libm v0.2.15
#79 3.310   Downloaded icu_properties_data v2.0.1
#79 3.333   Downloaded rand v0.9.2
#79 3.344   Downloaded rand v0.8.5
#79 3.355   Downloaded rsa v0.9.8
#79 3.384   Downloaded reqwest v0.11.27
#79 3.400   Downloaded ring v0.17.14
#79 3.519   Downloaded num-bigint-dig v0.8.4
#79 3.533   Downloaded regex-syntax v0.8.6
#79 3.560   Downloaded serde v1.0.219
#79 3.596   Downloaded rustls-webpki v0.103.4
#79 3.596   Downloaded openssl-sys v0.9.109
#79 3.611   Downloaded serde_json v1.0.143
#79 3.644   Downloaded rustls v0.23.31
#79 3.708   Downloaded libc v0.2.175
#79 3.848   Downloaded zstd-sys v2.0.15+zstd.1.5.7
#79 3.934   Downloaded jiff v0.2.15
#79 3.989   Downloaded idna v1.1.0
#79 4.008   Downloaded unicode-normalization v0.1.24
#79 4.011   Downloaded mio v1.0.4
#79 4.052   Downloaded memchr v2.7.5
#79 4.070   Downloaded indexmap v2.11.0
#79 4.112   Downloaded zerovec v0.11.4
#79 4.160   Downloaded openssl v0.10.73
#79 4.188   Downloaded url v2.5.7
#79 4.224   Downloaded pem v3.0.5
#79 4.224   Downloaded parking_lot_core v0.9.11
#79 4.224   Downloaded parking_lot v0.12.4
#79 4.261   Downloaded parking v2.2.1
#79 4.261   Downloaded openssl-probe v0.1.6
#79 4.267   Downloaded openssl-macros v0.1.1
#79 4.267   Downloaded once_cell v1.21.3
#79 4.274   Downloaded socket2 v0.6.0
#79 4.283   Downloaded socket2 v0.5.10
#79 4.292   Downloaded socket2 v0.4.10
#79 4.293   Downloaded smallvec v1.15.1
#79 4.324   Downloaded slab v0.4.11
#79 4.324   Downloaded signal-hook-registry v1.4.6
#79 4.324   Downloaded sharded-slab v0.1.7
#79 4.329   Downloaded sha2 v0.10.9
#79 4.348   Downloaded miniz_oxide v0.8.9
#79 4.380   Downloaded icu_normalizer_data v2.0.0
#79 4.380   Downloaded icu_locale_core v2.0.0
#79 4.402   Downloaded icu_collections v2.0.0
#79 4.440   Downloaded zerotrie v0.2.2
#79 4.440   Downloaded typenum v1.18.0
#79 4.467   Downloaded tokio v1.47.1
#79 4.632   Downloaded signature v2.2.0
#79 4.668   Downloaded shlex v1.3.0
#79 4.668   Downloaded pin-utils v0.1.0
#79 4.668   Downloaded pin-project-internal v1.1.10
#79 4.668   Downloaded pin-project v1.1.10
#79 4.736   Downloaded pin-project-lite v0.2.16
#79 4.736   Downloaded percent-encoding v2.3.2
#79 4.736   Downloaded libsqlite3-sys v0.30.1
#79 5.050   Downloaded sha1_smol v1.0.1
#79 5.056   Downloaded sha1 v0.10.6
#79 5.061   Downloaded serde_urlencoded v0.7.1
#79 5.096   Downloaded serde_derive v1.0.219
#79 5.096   Downloaded scopeguard v1.2.0
#79 5.096   Downloaded ryu v1.0.20
#79 5.121   Downloaded rustls-pki-types v1.12.0
#79 5.160   Downloaded rustls-pemfile v1.0.4
#79 5.160   Downloaded rand_core v0.6.4
#79 5.160   Downloaded rand_chacha v0.3.1
#79 5.160   Downloaded syn v2.0.106
#79 5.202   Downloaded rand_chacha v0.9.0
#79 5.206   Downloaded quote v1.0.40
#79 5.224   Downloaded proc-macro2 v1.0.101
#79 5.224   Downloaded ppv-lite86 v0.2.21
#79 5.224   Downloaded powerfmt v0.2.0
#79 5.244   Downloaded potential_utf v0.1.3
#79 5.244   Downloaded pkg-config v0.3.32
#79 5.256   Downloaded pkcs8 v0.10.2
#79 5.256   Downloaded pkcs1 v0.7.5
#79 5.288   Downloaded num-conv v0.1.0
#79 5.288   Downloaded nu-ansi-term v0.50.1
#79 5.288   Downloaded tracing-subscriber v0.3.20
#79 5.347   Downloaded tracing v0.1.41
#79 5.360   Downloaded tokio-util v0.7.16
#79 5.396   Downloaded time v0.3.41
#79 5.440   Downloaded sqlx-postgres v0.8.6
#79 5.484   Downloaded encoding_rs v0.8.35
#79 5.546   Downloaded icu_normalizer v2.0.0
#79 5.563   Downloaded uuid v1.18.0
#79 5.572   Downloaded unicode-bidi v0.3.18
#79 5.581   Downloaded tracing-core v0.1.34
#79 5.586   Downloaded sqlx-sqlite v0.8.6
#79 5.598   Downloaded sqlx-core v0.8.6
#79 5.628   Downloaded sqlx v0.8.6
#79 5.682   Downloaded brotli v8.0.2
#79 5.751   Downloaded num-integer v0.1.46
#79 5.758   Downloaded log v0.4.27
#79 5.765   Downloaded lazy_static v1.5.0
#79 5.772   Downloaded language-tags v0.3.2
#79 5.788   Downloaded jsonwebtoken v9.3.1
#79 5.798   Downloaded jobserver v0.1.34
#79 5.816   Downloaded icu_provider v2.0.0
#79 5.816   Downloaded zstd-safe v7.2.4
#79 5.827   Downloaded zstd v0.13.3
#79 5.837   Downloaded yoke v0.8.0
#79 5.843   Downloaded utf8parse v0.2.2
#79 5.856   Downloaded unicode-properties v0.1.3
#79 5.866   Downloaded unicode-ident v1.0.18
#79 5.866   Downloaded tracing-attributes v0.1.30
#79 5.884   Downloaded tokio-stream v0.1.17
#79 5.900   Downloaded tinyvec v1.10.0
#79 5.919   Downloaded time-macros v0.2.22
#79 5.929   Downloaded sqlx-macros-core v0.8.6
#79 5.954   Downloaded hyper v0.14.32
#79 5.954   Downloaded hkdf v0.12.4
#79 5.961   Downloaded hashbrown v0.15.5
#79 5.974   Downloaded h2 v0.3.27
#79 5.990   Downloaded futures-util v0.3.31
#79 6.051   Downloaded combine v4.6.7
#79 6.073   Downloaded chrono v0.4.41
#79 6.087   Downloaded cc v1.2.34
#79 6.097   Downloaded brotli-decompressor v5.0.0
#79 6.142   Downloaded aho-corasick v1.1.3
#79 6.153   Downloaded actix-web v4.11.0
#79 6.190   Downloaded actix-http v3.11.1
#79 6.220   Downloaded native-tls v0.2.14
#79 6.226   Downloaded mime v0.3.17
#79 6.230   Downloaded md-5 v0.10.6
#79 6.236   Downloaded lock_api v0.4.13
#79 6.240   Downloaded local-channel v0.1.5
#79 6.242   Downloaded litemap v0.8.0
#79 6.250   Downloaded itoa v1.0.15
#79 6.252   Downloaded is_terminal_polyfill v1.70.1
#79 6.255   Downloaded ipnet v2.11.0
#79 6.259   Downloaded inout v0.1.4
#79 6.272   Downloaded impl-more v0.1.9
#79 6.272   Downloaded idna_adapter v1.2.1
#79 6.272   Downloaded zerovec-derive v0.11.1
#79 6.273   Downloaded zeroize v1.8.1
#79 6.279   Downloaded zerofrom-derive v0.1.6
#79 6.279   Downloaded yoke-derive v0.8.0
#79 6.281   Downloaded writeable v0.6.1
#79 6.285   Downloaded whoami v1.6.1
#79 6.290   Downloaded webpki-***s v0.26.11
#79 6.293   Downloaded want v0.3.1
#79 6.300   Downloaded version_check v0.9.5
#79 6.300   Downloaded utf8_iter v1.0.4
#79 6.301   Downloaded untrusted v0.9.0
#79 6.321   Downloaded unicode-xid v0.2.6
#79 6.321   Downloaded tracing-log v0.2.0
#79 6.325   Downloaded tokio-native-tls v0.3.1
#79 6.331   Downloaded tokio-macros v2.5.0
#79 6.340   Downloaded tinystr v0.8.1
#79 6.356   Downloaded time-core v0.1.4
#79 6.356   Downloaded thread_local v1.1.9
#79 6.356   Downloaded thiserror-impl v2.0.16
#79 6.356   Downloaded thiserror v2.0.16
#79 6.370   Downloaded synstructure v0.13.2
#79 6.372   Downloaded subtle v2.6.1
#79 6.376   Downloaded stable_deref_trait v1.2.0
#79 6.379   Downloaded sqlx-mysql v0.8.6
#79 6.395   Downloaded httparse v1.10.1
#79 6.408   Downloaded http v0.2.12
#79 6.420   Downloaded hmac v0.12.1
#79 6.426   Downloaded getrandom v0.3.3
#79 6.435   Downloaded getrandom v0.2.16
#79 6.444   Downloaded futures-intrusive v0.5.0
#79 6.457   Downloaded futures v0.3.31
#79 6.470   Downloaded flume v0.11.1
#79 6.480   Downloaded flate2 v1.1.2
#79 6.493   Downloaded event-listener v5.4.1
#79 6.498   Downloaded env_logger v0.11.8
#79 6.506   Downloaded derive_more-impl v2.0.1
#79 6.523   Downloaded derive_more v2.0.1
#79 6.548   Downloaded der v0.7.10
#79 6.561   Downloaded crossbeam-utils v0.8.21
#79 6.568   Downloaded crc32fast v1.5.0
#79 6.574   Downloaded cookie v0.16.2
#79 6.580   Downloaded const-oid v0.9.6
#79 6.586   Downloaded bytes v1.10.1
#79 6.598   Downloaded bitflags v2.9.3
#79 6.608   Downloaded base64 v0.22.1
#79 6.616   Downloaded base64 v0.21.7
#79 6.626   Downloaded arc-swap v1.7.1
#79 6.635   Downloaded anyhow v1.0.99
#79 6.645   Downloaded allocator-api2 v0.2.21
#79 6.654   Downloaded actix-server v2.6.0
#79 6.661   Downloaded local-waker v0.1.4
#79 6.663   Downloaded zerofrom v0.1.6
#79 6.668   Downloaded try-lock v0.2.5
#79 6.672   Downloaded tower-service v0.3.3
#79 6.675   Downloaded tokio-retry v0.3.0
#79 6.681   Downloaded tinyvec_macros v0.1.1
#79 6.684   Downloaded sync_wrapper v0.1.2
#79 6.685   Downloaded spki v0.7.3
#79 6.691   Downloaded spin v0.9.8
#79 6.699   Downloaded hyper-tls v0.5.0
#79 6.702   Downloaded http-body v0.4.6
#79 6.708   Downloaded home v0.5.11
#79 6.710   Downloaded hex v0.4.3
#79 6.715   Downloaded heck v0.5.0
#79 6.718   Downloaded hashlink v0.10.0
#79 6.725   Downloaded generic-array v0.14.7
#79 6.729   Downloaded futures-task v0.3.31
#79 6.733   Downloaded futures-sink v0.3.31
#79 6.735   Downloaded futures-macro v0.3.31
#79 6.741   Downloaded futures-io v0.3.31
#79 6.741   Downloaded futures-executor v0.3.31
#79 6.742   Downloaded futures-core v0.3.31
#79 6.745   Downloaded futures-channel v0.3.31
#79 6.749   Downloaded form_urlencoded v1.2.2
#79 6.752   Downloaded foldhash v0.1.5
#79 6.757   Downloaded fnv v1.0.7
#79 6.759   Downloaded env_filter v0.1.3
#79 6.762   Downloaded either v1.15.0
#79 6.766   Downloaded dotenvy v0.15.7
#79 6.773   Downloaded displaydoc v0.2.5
#79 6.779   Downloaded digest v0.10.7
#79 6.783   Downloaded deranged v0.4.0
#79 6.787   Downloaded crypto-common v0.1.6
#79 6.790   Downloaded crossbeam-queue v0.3.12
#79 6.794   Downloaded crc-catalog v2.4.0
#79 6.798   Downloaded crc v3.3.0
#79 6.803   Downloaded cpufeatures v0.2.17
#79 6.807   Downloaded concurrent-queue v2.5.0
#79 6.813   Downloaded colorchoice v1.0.4
#79 6.814   Downloaded cipher v0.4.4
#79 6.819   Downloaded cfg-if v1.0.3
#79 6.822   Downloaded bytestring v1.4.0
#79 6.824   Downloaded byteorder v1.5.0
#79 6.830   Downloaded blowfish v0.9.1
#79 6.833   Downloaded block-buffer v0.10.4
#79 6.836   Downloaded bcrypt v0.15.1
#79 6.840   Downloaded base64ct v1.8.0
#79 6.846   Downloaded autocfg v1.5.0
#79 6.851   Downloaded atoi v2.0.0
#79 6.855   Downloaded async-trait v0.1.89
#79 6.864   Downloaded anstyle-query v1.1.4
#79 6.867   Downloaded anstyle-parse v0.2.7
#79 6.871   Downloaded anstyle v1.0.11
#79 6.875   Downloaded anstream v0.6.20
#79 6.879   Downloaded alloc-stdlib v0.2.2
#79 6.882   Downloaded alloc-no-stdlib v2.0.4
#79 6.887   Downloaded adler2 v2.0.1
#79 6.890   Downloaded actix-web-codegen v4.3.0
#79 6.898   Downloaded actix-utils v3.0.1
#79 6.902   Downloaded actix-service v2.0.3
#79 6.907   Downloaded actix-rt v2.10.0
#79 6.916   Downloaded actix-cors v0.7.1
#79 6.933   Downloaded sqlx-macros v0.8.6
#79 6.933   Downloaded iana-time-zone v0.1.63
#79 6.933   Downloaded httpdate v1.0.3
#79 6.934   Downloaded foreign-types-shared v0.1.1
#79 6.938   Downloaded foreign-types v0.3.2
#79 6.938   Downloaded equivalent v1.0.2
#79 6.940   Downloaded actix-macros v0.2.4
#79 7.236    Compiling proc-macro2 v1.0.101
#79 7.236    Compiling unicode-ident v1.0.18
#79 7.441    Compiling libc v0.2.175
#79 8.152    Compiling serde v1.0.219
#79 9.864    Compiling quote v1.0.40
#79 10.57    Compiling syn v2.0.106
#79 11.39    Compiling cfg-if v1.0.3
#79 11.46    Compiling autocfg v1.5.0
#79 14.81    Compiling jobserver v0.1.34
#79 15.62    Compiling shlex v1.3.0
#79 15.97    Compiling cc v1.2.34
#79 20.12    Compiling version_check v0.9.5
#79 20.66    Compiling typenum v1.18.0
#79 21.29    Compiling synstructure v0.13.2
#79 22.50    Compiling generic-array v0.14.7
#79 22.74    Compiling lock_api v0.4.13
#79 23.00    Compiling parking_lot_core v0.9.11
#79 23.29    Compiling pin-project-lite v0.2.16
#79 23.38    Compiling log v0.4.27
#79 23.77    Compiling memchr v2.7.5
#79 25.37    Compiling serde_derive v1.0.219
#79 25.67    Compiling zerofrom-derive v0.1.6
#79 28.83    Compiling yoke-derive v0.8.0
#79 31.40    Compiling zerovec-derive v0.11.1
#79 33.80    Compiling displaydoc v0.2.5
#79 35.08    Compiling futures-core v0.3.31
#79 35.26    Compiling bytes v1.10.1
#79 37.22    Compiling icu_properties_data v2.0.1
#79 37.45    Compiling icu_normalizer_data v2.0.0
#79 37.70    Compiling scopeguard v1.2.0
#79 38.22    Compiling tracing-attributes v0.1.30
#79 40.58    Compiling smallvec v1.15.1
#79 41.19    Compiling zerocopy v0.8.26
#79 41.80    Compiling parking_lot v0.12.4
#79 41.97    Compiling once_cell v1.21.3
#79 42.39    Compiling zerofrom v0.1.6
#79 42.62    Compiling tokio-macros v2.5.0
#79 43.15    Compiling mio v1.0.4
#79 44.05    Compiling signal-hook-registry v1.4.6
#79 44.32    Compiling socket2 v0.6.0
#79 44.97    Compiling futures-sink v0.3.31
#79 45.07    Compiling itoa v1.0.15
#79 45.24    Compiling stable_deref_trait v1.2.0
#79 45.32    Compiling yoke v0.8.0
#79 45.67    Compiling tokio v1.47.1
#79 54.07    Compiling pkg-config v0.3.32
#79 57.29    Compiling zerovec v0.11.4
#79 60.17    Compiling crossbeam-utils v0.8.21
#79 60.63    Compiling tracing-core v0.1.34
#79 67.16    Compiling crypto-common v0.1.6
#79 67.60    Compiling futures-channel v0.3.31
#79 68.34    Compiling futures-macro v0.3.31
#79 69.68    Compiling futures-task v0.3.31
#79 70.07    Compiling futures-io v0.3.31
#79 70.44    Compiling serde_json v1.0.143
#79 70.80    Compiling slab v0.4.11
#79 71.06    Compiling pin-utils v0.1.0
#79 71.15    Compiling tracing v0.1.41
#79 71.28    Compiling futures-util v0.3.31
#79 72.02    Compiling tinystr v0.8.1
#79 72.51    Compiling writeable v0.6.1
#79 73.59    Compiling litemap v0.8.0
#79 74.29    Compiling subtle v2.6.1
#79 74.70    Compiling icu_locale_core v2.0.0
#79 80.66    Compiling potential_utf v0.1.3
#79 80.93    Compiling zerotrie v0.2.2
#79 81.23    Compiling getrandom v0.2.16
#79 81.64    Compiling equivalent v1.0.2
#79 81.74    Compiling foldhash v0.1.5
#79 81.79    Compiling thiserror v2.0.16
#79 82.17    Compiling allocator-api2 v0.2.21
#79 82.31    Compiling icu_provider v2.0.0
#79 83.26    Compiling hashbrown v0.15.5
#79 85.24    Compiling icu_collections v2.0.0
#79 86.76    Compiling block-buffer v0.10.4
#79 87.41    Compiling percent-encoding v2.3.2
#79 90.23    Compiling getrandom v0.3.3
#79 90.83    Compiling ppv-lite86 v0.2.21
#79 92.26    Compiling digest v0.10.7
#79 93.15    Compiling thiserror-impl v2.0.16
#79 93.17    Compiling num-traits v0.2.19
#79 93.63    Compiling bitflags v2.9.3
#79 94.27    Compiling rustls v0.23.31
#79 95.82    Compiling icu_normalizer v2.0.0
#79 96.15    Compiling icu_properties v2.0.1
#79 99.65    Compiling indexmap v2.11.0
#79 100.4    Compiling tokio-util v0.7.16
#79 101.9    Compiling ring v0.17.14
#79 102.8    Compiling fnv v1.0.7
#79 102.9    Compiling vcpkg v0.2.15
#79 103.0    Compiling zeroize v1.8.1
#79 103.3    Compiling ryu v1.0.20
#79 103.8    Compiling rustls-pki-types v1.12.0
#79 104.2    Compiling openssl-sys v0.9.109
#79 105.4    Compiling http v0.2.12
#79 110.0    Compiling idna_adapter v1.2.1
#79 110.7    Compiling form_urlencoded v1.2.2
#79 111.1    Compiling aho-corasick v1.1.3
#79 113.9    Compiling base64 v0.22.1
#79 115.0    Compiling regex-syntax v0.8.6
#79 118.3    Compiling utf8_iter v1.0.4
#79 118.5    Compiling idna v1.1.0
#79 121.9    Compiling regex-automata v0.4.10
#79 143.5    Compiling zstd-sys v2.0.15+zstd.1.5.7
#79 144.5    Compiling cpufeatures v0.2.17
#79 144.6    Compiling untrusted v0.9.0
#79 144.9    Compiling httparse v1.10.1
#79 161.5    Compiling url v2.5.7
#79 168.2    Compiling powerfmt v0.2.0
#79 168.5    Compiling num-conv v0.1.0
#79 168.9    Compiling tinyvec_macros v0.1.1
#79 169.6    Compiling time-core v0.1.4
#79 171.5    Compiling time-macros v0.2.22
#79 182.3    Compiling tinyvec v1.10.0
#79 183.4    Compiling deranged v0.4.0
#79 200.8    Compiling rustls-webpki v0.103.4
#79 204.8    Compiling concurrent-queue v2.5.0
#79 205.2    Compiling h2 v0.3.27
#79 223.2    Compiling webpki-***s v1.0.2
#79 223.4    Compiling rand_core v0.6.4
#79 224.6    Compiling socket2 v0.5.10
#79 226.1    Compiling crc32fast v1.5.0
#79 226.8    Compiling zstd-safe v7.2.4
#79 227.1    Compiling iana-time-zone v0.1.63
#79 227.6    Compiling foreign-types-shared v0.1.1
#79 227.6    Compiling parking v2.2.1
#79 228.3    Compiling local-waker v0.1.4
#79 228.4    Compiling openssl v0.10.73
#79 228.7    Compiling crc-catalog v2.4.0
#79 229.3    Compiling httpdate v1.0.3
#79 229.9    Compiling alloc-no-stdlib v2.0.4
#79 230.4    Compiling time v0.3.41
#79 237.8    Compiling sha2 v0.10.9
#79 238.5    Compiling alloc-stdlib v0.2.2
#79 239.6    Compiling crc v3.3.0
#79 242.8    Compiling event-listener v5.4.1
#79 243.2    Compiling foreign-types v0.3.2
#79 243.3    Compiling chrono v0.4.41
#79 246.2    Compiling rand_chacha v0.3.1
#79 247.7    Compiling webpki-***s v0.26.11
#79 248.5    Compiling futures-intrusive v0.5.0
#79 249.5    Compiling tokio-stream v0.1.17
#79 250.3    Compiling unicode-normalization v0.1.24
#79 253.2    Compiling hashlink v0.10.0
#79 257.8    Compiling crossbeam-queue v0.3.12
#79 258.0    Compiling regex v1.11.2
#79 259.9    Compiling hmac v0.12.1
#79 260.1    Compiling rand_core v0.9.3
#79 260.5    Compiling either v1.15.0
#79 260.8    Compiling openssl-macros v0.1.1
#79 261.0    Compiling uuid v1.18.0
#79 261.4    Compiling unicode-xid v0.2.6
#79 261.6    Compiling native-tls v0.2.14
#79 261.6    Compiling unicode-bidi v0.3.18
#79 261.8    Compiling unicode-properties v0.1.3
#79 262.7    Compiling adler2 v2.0.1
#79 262.9    Compiling miniz_oxide v0.8.9
#79 264.0    Compiling sqlx-core v0.8.6
#79 265.1    Compiling stringprep v0.1.5
#79 266.0    Compiling derive_more-impl v2.0.1
#79 272.3    Compiling rand_chacha v0.9.0
#79 273.8    Compiling hkdf v0.12.4
#79 274.0    Compiling rand v0.8.5
#79 278.0    Compiling brotli-decompressor v5.0.0
#79 282.3    Compiling actix-utils v3.0.1
#79 284.3    Compiling atoi v2.0.0
#79 284.6    Compiling md-5 v0.10.6
#79 284.8    Compiling bytestring v1.4.0
#79 285.2    Compiling actix-rt v2.10.0
#79 287.6    Compiling actix-service v2.0.3
#79 288.4    Compiling cookie v0.16.2
#79 288.6    Compiling encoding_rs v0.8.35
#79 289.9    Compiling dotenvy v0.15.7
#79 290.5    Compiling whoami v1.6.1
#79 290.9    Compiling try-lock v0.2.5
#79 291.7    Compiling home v0.5.11
#79 291.8    Compiling byteorder v1.5.0
#79 292.4    Compiling mime v0.3.17
#79 293.2    Compiling hex v0.4.3
#79 293.9    Compiling openssl-probe v0.1.6
#79 294.4    Compiling regex-lite v0.1.7
#79 294.9    Compiling sqlx-postgres v0.8.6
#79 296.3    Compiling actix-router v0.5.3
#79 306.4    Compiling want v0.3.1
#79 311.2    Compiling zstd v0.13.3
#79 311.9    Compiling brotli v8.0.2
#79 323.0    Compiling flate2 v1.1.2
#79 324.1    Compiling rand v0.9.2
#79 325.9    Compiling derive_more v2.0.1
#79 327.7    Compiling local-channel v0.1.5
#79 328.2    Compiling sha1 v0.10.6
#79 331.0    Compiling num-integer v0.1.46
#79 332.1    Compiling serde_urlencoded v0.7.1
#79 332.6    Compiling http-body v0.4.6
#79 332.7    Compiling actix-codec v0.5.2
#79 334.6    Compiling inout v0.1.4
#79 335.9    Compiling pin-project-internal v1.1.10
#79 339.9    Compiling heck v0.5.0
#79 340.0    Compiling utf8parse v0.2.2
#79 340.1    Compiling tower-service v0.3.3
#79 340.2    Compiling language-tags v0.3.2
#79 340.2    Compiling hyper v0.14.32
#79 342.7    Compiling actix-http v3.11.1
#79 352.8    Compiling anstyle-parse v0.2.7
#79 353.1    Compiling sqlx-macros-core v0.8.6
#79 358.1    Compiling pin-project v1.1.10
#79 361.1    Compiling cipher v0.4.4
#79 361.7    Compiling num-bigint v0.4.6
#79 372.1    Compiling tokio-native-tls v0.3.1
#79 372.4    Compiling actix-web-codegen v4.3.0
#79 372.8    Compiling actix-server v2.6.0
#79 375.1    Compiling futures-executor v0.3.31
#79 375.9    Compiling actix-macros v0.2.4
#79 376.9    Compiling base64 v0.21.7
#79 378.2    Compiling is_terminal_polyfill v1.70.1
#79 378.3    Compiling anstyle-query v1.1.4
#79 378.4    Compiling impl-more v0.1.9
#79 379.2    Compiling lazy_static v1.5.0
#79 379.3    Compiling anstyle v1.0.11
#79 382.4    Compiling anyhow v1.0.99
#79 382.9    Compiling colorchoice v1.0.4
#79 383.0    Compiling anstream v0.6.20
#79 384.0    Compiling sharded-slab v0.1.7
#79 385.7    Compiling actix-web v4.11.0
#79 403.8    Compiling rustls-pemfile v1.0.4
#79 404.3    Compiling futures v0.3.31
#79 404.4    Compiling hyper-tls v0.5.0
#79 404.8    Compiling simple_asn1 v0.6.3
#79 406.5    Compiling blowfish v0.9.1
#79 406.8    Compiling tokio-retry v0.3.0
#79 407.2    Compiling sqlx-macros v0.8.6
#79 408.8    Compiling env_filter v0.1.3
#79 410.0    Compiling matchers v0.2.0
#79 410.2    Compiling pem v3.0.5
#79 411.3    Compiling combine v4.6.7
#79 422.8    Compiling tracing-log v0.2.0
#79 423.4    Compiling async-trait v0.1.89
#79 423.9    Compiling socket2 v0.4.10
#79 425.0    Compiling thread_local v1.1.9
#79 425.6    Compiling nu-ansi-term v0.50.1
#79 425.9    Compiling arc-swap v1.7.1
#79 426.5    Compiling jiff v0.2.15
#79 426.6    Compiling ipnet v2.11.0
#79 428.4    Compiling sha1_smol v1.0.1
#79 428.8    Compiling sync_wrapper v0.1.2
#79 428.9    Compiling reqwest v0.11.27
#79 446.8    Compiling env_logger v0.11.8
#79 448.6    Compiling redis v0.24.0
#79 453.8    Compiling tracing-subscriber v0.3.20
#79 461.5    Compiling jsonwebtoken v9.3.1
#79 465.9    Compiling sqlx v0.8.6
#79 466.0    Compiling bcrypt v0.15.1
#79 466.5    Compiling actix-cors v0.7.1
#79 468.2    Compiling viworks-admin-backend v0.1.0 (/app)
#79 476.3     Finished `release` profile [optimized] target(s) in 7m 55s
#79 476.3 warning: the following packages contain code that will be rejected by a future version of Rust: redis v0.24.0
#79 476.3 note: to see what the problems were, use the option `--future-incompat-report`, or run `cargo report future-incompatibilities --id 1`
#79 DONE 476.7s
#80 [backend builder  8/11] RUN rm src/main.rs
#80 DONE 0.3s
#81 [backend builder  9/11] COPY src ./src
#81 DONE 0.1s
#82 [backend builder 10/11] COPY migrations ./migrations
#82 DONE 0.0s
#83 [backend builder 11/11] RUN cargo build --release
#83 1.050     Finished `release` profile [optimized] target(s) in 0.69s
#83 1.051 warning: the following packages contain code that will be rejected by a future version of Rust: redis v0.24.0
#83 1.067 note: to see what the problems were, use the option `--future-incompat-report`, or run `cargo report future-incompatibilities --id 1`
#83 DONE 1.1s
#84 [backend stage-1 2/7] RUN apk add --no-cache     ca-certificates     dumb-init     busybox-extras     netcat-openbsd     wget     curl     tzdata     bash     postgresql-client     redis
#84 CACHED
#85 [backend stage-1 3/7] WORKDIR /app
#85 CACHED
#86 [backend stage-1 4/7] COPY --from=builder /app/target/release/viworks-admin-backend /app/app
#86 DONE 0.0s
#87 [backend stage-1 5/7] COPY --from=builder /app/migrations /app/migrations
#87 DONE 0.0s
#88 [backend stage-1 6/7] COPY ops/entrypoint.sh /app/entrypoint.sh
#88 DONE 0.0s
#89 [backend stage-1 7/7] RUN adduser -D -u 10001 appuser &&     chown -R appuser:appuser /app &&     chmod +x /app/entrypoint.sh
#89 DONE 0.3s
#90 [backend] exporting to image
#90 exporting layers 0.1s done
#90 writing image sha256:3eb859c3e7e49a67449b5e8b8ebe7b839d28d0886420f22c5d15ed565e21a1cd done
#90 naming to docker.io/library/digitaloceandocker-backend done
#90 DONE 0.1s
#91 [backend] resolving provenance for metadata file
#91 DONE 0.0s
 digitaloceandocker-website  Built
 digitaloceandocker-agent  Built
 digitaloceandocker-backend  Built
 digitaloceandocker-frontend  Built
 Container viworks-redis  Creating
 Container viworks-website  Creating
 Container viworks-nginx  Creating
 Container viworks-agent  Creating
 Container viworks-postgres  Creating
 Container viworks-postgres  Created
 Container viworks-website  Created
 Container viworks-agent  Created
 Container viworks-redis  Created
 Container viworks-backend  Creating
 Container viworks-nginx  Created
 Container viworks-backend  Created
 Container viworks-frontend  Creating
 Container viworks-frontend  Created
 Container viworks-redis  Starting
 Container viworks-website  Starting
 Container viworks-agent  Starting
 Container viworks-nginx  Starting
 Container viworks-postgres  Starting
 Container viworks-redis  Started
 Container viworks-postgres  Started
 Container viworks-postgres  Waiting
 Container viworks-redis  Waiting
 Container viworks-website  Started
 Container viworks-agent  Started
 Container viworks-nginx  Started
 Container viworks-postgres  Healthy
 Container viworks-redis  Healthy
 Container viworks-backend  Starting
 Container viworks-backend  Started
 Container viworks-frontend  Starting
 Container viworks-frontend  Started
⏳ Waiting for services to be ready...
✅ Services are starting up...
🔍 Checking individual service health...
🔍 Checking postgres health...
✅ postgres is healthy
🔍 Checking redis health...
✅ redis is healthy
🔍 Checking backend health...
⏳ Waiting for backend to be healthy... (1/30)
⏳ Waiting for backend to be healthy... (2/30)
⏳ Waiting for backend to be healthy... (3/30)
⏳ Waiting for backend to be healthy... (4/30)
⏳ Waiting for backend to be healthy... (5/30)
⏳ Waiting for backend to be healthy... (6/30)
⏳ Waiting for backend to be healthy... (7/30)
⏳ Waiting for backend to be healthy... (8/30)
⏳ Waiting for backend to be healthy... (9/30)
⏳ Waiting for backend to be healthy... (10/30)
⏳ Waiting for backend to be healthy... (11/30)
⏳ Waiting for backend to be healthy... (12/30)
⏳ Waiting for backend to be healthy... (13/30)
⏳ Waiting for backend to be healthy... (14/30)
⏳ Waiting for backend to be healthy... (15/30)
⏳ Waiting for backend to be healthy... (16/30)
⏳ Waiting for backend to be healthy... (17/30)
⏳ Waiting for backend to be healthy... (18/30)
⏳ Waiting for backend to be healthy... (19/30)
⏳ Waiting for backend to be healthy... (20/30)
⏳ Waiting for backend to be healthy... (21/30)
⏳ Waiting for backend to be healthy... (22/30)
⏳ Waiting for backend to be healthy... (23/30)
⏳ Waiting for backend to be healthy... (24/30)
⏳ Waiting for backend to be healthy... (25/30)
⏳ Waiting for backend to be healthy... (26/30)
⏳ Waiting for backend to be healthy... (27/30)
⏳ Waiting for backend to be healthy... (28/30)
⏳ Waiting for backend to be healthy... (29/30)
⏳ Waiting for backend to be healthy... (30/30)
❌ backend failed to become healthy
Error: Process completed with exit code 1.
0s
0s
Run if [ failure == 'success' ]; then
❌ Deployment failed. Check the logs above for details.
🔧 Manual troubleshooting may be required on the server.
🔍 Run './check-backend-status.sh' on the server for diagnostics.
0s
Post job cleanup.
/usr/bin/git version
git version 2.51.0
Temporarily overriding HOME='/home/runner/work/_temp/70587c6c-ecab-4e9c-9cb1-6c3fb0fa1fd3' before making global git config changes
Adding repository directory to the temporary git global config as a safe directory
/usr/bin/git config --global --add safe.directory /home/runner/work/viworkdemo002/viworkdemo002
/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
http.https://github.com/.extraheader
/usr/bin/git config --local --unset-all http.https://github.com/.extraheader
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
