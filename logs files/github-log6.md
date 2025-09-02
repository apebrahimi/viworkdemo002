deploy
Started 4m 5s ago

1s
1s
2s
3s
0s
3m 57s
Run scp -i ~/.ssh/id_ed25519 deploy.sh ${DROPLET_USER}@${DROPLET_IP}:/tmp/
🚀 Starting ViWorks Automated Deployment...
📅 Deployment started at: Tue Sep  2 07:11:22 UTC 2025
🛑 Stopping all containers gracefully...
 Container viworks-nginx  Stopping
 Container viworks-agent  Stopping
 Container viworks-nginx  Stopped
 Container viworks-nginx  Removing
 Container viworks-agent  Stopped
 Container viworks-agent  Removing
 Container viworks-nginx  Removed
 Container viworks-website  Stopping
 Container viworks-frontend  Stopping
 Container viworks-agent  Removed
 Container viworks-website  Stopped
 Container viworks-website  Removing
 Container viworks-website  Removed
 Container viworks-frontend  Stopped
 Container viworks-frontend  Removing
 Container viworks-frontend  Removed
 Container viworks-backend  Stopping
 Container viworks-backend  Stopped
 Container viworks-backend  Removing
 Container viworks-backend  Removed
 Container viworks-postgres  Stopping
 Container viworks-redis  Stopping
 Container viworks-postgres  Stopped
 Container viworks-postgres  Removing
 Container viworks-postgres  Removed
 Container viworks-redis  Stopped
 Container viworks-redis  Removing
 Container viworks-redis  Removed
🛑 Force stopping any running containers...
🧹 Removing containers with specific names...
🧹 Removing orphaned containers...
time="2025-09-02T07:11:23Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
🧹 Cleaning up Docker images...
Total reclaimed space: 0B
Deleted Images:
untagged: digitaloceandocker-website:latest
deleted: sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a
untagged: digitaloceandocker-agent:latest
deleted: sha256:c72f3fb0a5146067e1440591134c67a46d7757775718b8a075a1596f8457d136
untagged: digitaloceandocker-backend:latest
deleted: sha256:e48fbc3b657cba6cae4eee23d960496857b0e131ee3680c6ed9147c51094554c
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
Total reclaimed space: 351MB
🧹 Cleaning up unused networks...
Deleted Networks:
viworks-public
viworks-internal
🔍 Verifying no conflicting containers exist...
🧹 Cleaning up and resetting git repository...
From https://github.com/apebrahimi/viworkdemo002
   7f8be8c..6f15b05  main       -> origin/main
HEAD is now at 6f15b05 FIX: Nginx configuration - remove duplicate proxy_read_timeout directives
🌐 Setting up two-network security architecture...
62789220c1e3043bab85f86fe975e8668de42004295592c2002d3de4ff96a79e
df850096d6b8af6381b3c275b7c67de7085c12cbf2b4ee21b53e64b209065030
🔨 Building and starting new containers with two-network security...
 postgres Pulling 
 redis Pulling 
 nginx Pulling 
 9824c27679d3 Already exists 
 6bc572a340ec Pulling fs layer 
 403e3f251637 Pulling fs layer 
 9adfbae99cb7 Pulling fs layer 
 7a8a46741e18 Pulling fs layer 
 c9ebe2ff2d2c Pulling fs layer 
 a992fbc61ecc Pulling fs layer 
 cb1ff4086f82 Pulling fs layer 
 c9ebe2ff2d2c Waiting 
 a992fbc61ecc Waiting 
 cb1ff4086f82 Waiting 
 7a8a46741e18 Waiting 
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
 a15854d6fd91 Pulling fs layer 
 685be96195b7 Pulling fs layer 
 ce414b3fa674 Pulling fs layer 
 6afcd9ec0fd9 Pulling fs layer 
 61a7421693bd Waiting 
 51a939567803 Waiting 
 a612d38c9b48 Waiting 
 901a9540064a Waiting 
 6c13c55b4b82 Waiting 
 0f940631c13f Waiting 
 a15854d6fd91 Waiting 
 685be96195b7 Waiting 
 ce414b3fa674 Waiting 
 6afcd9ec0fd9 Waiting 
 6bc572a340ec Downloading [>                                                  ]  19.17kB/1.806MB
 9adfbae99cb7 Downloading [==================================================>]     955B/955B
 403e3f251637 Downloading [==================================================>]     628B/628B
 9adfbae99cb7 Verifying Checksum 
 9adfbae99cb7 Download complete 
 403e3f251637 Verifying Checksum 
 403e3f251637 Download complete 
 6bc572a340ec Verifying Checksum 
 6bc572a340ec Extracting [>                                                  ]  32.77kB/1.806MB
 6bc572a340ec Extracting [==================================================>]  1.806MB/1.806MB
 6bc572a340ec Pull complete 
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Pull complete 
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Pull complete 
 c9ebe2ff2d2c Downloading [===========================================>       ]  1.049kB/1.209kB
 c9ebe2ff2d2c Downloading [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Download complete 
 a992fbc61ecc Downloading [=====================================>             ]  1.049kB/1.398kB
 a992fbc61ecc Downloading [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Verifying Checksum 
 a992fbc61ecc Download complete 
 7a8a46741e18 Downloading [==================================================>]     405B/405B
 7a8a46741e18 Verifying Checksum 
 7a8a46741e18 Download complete 
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 7a8a46741e18 Pull complete 
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Pull complete 
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Pull complete 
 0368fd46e3c6 Downloading [>                                                  ]  36.88kB/3.638MB
 cb1ff4086f82 Downloading [>                                                  ]  171.9kB/16.84MB
 4c55286bbede Downloading [==================================================>]     950B/950B
 4c55286bbede Verifying Checksum 
 4c55286bbede Download complete 
 0368fd46e3c6 Verifying Checksum 
 0368fd46e3c6 Download complete 
 0368fd46e3c6 Extracting [>                                                  ]  65.54kB/3.638MB
 cb1ff4086f82 Downloading [===========================>                       ]  9.368MB/16.84MB
 0368fd46e3c6 Extracting [====================>                              ]  1.507MB/3.638MB
 cb1ff4086f82 Verifying Checksum 
 cb1ff4086f82 Download complete 
 cb1ff4086f82 Extracting [>                                                  ]  196.6kB/16.84MB
 0368fd46e3c6 Extracting [==================================================>]  3.638MB/3.638MB
 0368fd46e3c6 Pull complete 
 cb1ff4086f82 Extracting [==>                                                ]  786.4kB/16.84MB
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Pull complete 
 311eca34042e Downloading [>                                                  ]  10.95kB/1.003MB
 cb1ff4086f82 Extracting [=========>                                         ]  3.342MB/16.84MB
 311eca34042e Verifying Checksum 
 311eca34042e Download complete 
 5e28347af205 Downloading [>                                                  ]  2.738kB/173.2kB
 5e28347af205 Verifying Checksum 
 5e28347af205 Download complete 
 5e28347af205 Extracting [=========>                                         ]  32.77kB/173.2kB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 cb1ff4086f82 Extracting [===================>                               ]  6.685MB/16.84MB
 e6fe6f07e192 Downloading [>                                                  ]  127.9kB/12.41MB
 cb1ff4086f82 Extracting [==========================>                        ]  8.847MB/16.84MB
 5e28347af205 Pull complete 
 311eca34042e Extracting [=>                                                 ]  32.77kB/1.003MB
 e6fe6f07e192 Downloading [========================>                          ]  6.185MB/12.41MB
 cb1ff4086f82 Extracting [==============================>                    ]  10.42MB/16.84MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 311eca34042e Pull complete 
 e6fe6f07e192 Downloading [====================================>              ]  8.978MB/12.41MB
 cb1ff4086f82 Extracting [====================================>              ]  12.19MB/16.84MB
 a2cadbfeca72 Downloading [==================================================>]      99B/99B
 a2cadbfeca72 Verifying Checksum 
 a2cadbfeca72 Download complete 
 4f4fb700ef54 Downloading [==================================================>]      32B/32B
 4f4fb700ef54 Verifying Checksum 
 4f4fb700ef54 Download complete 
 e6fe6f07e192 Verifying Checksum 
 e6fe6f07e192 Download complete 
 e6fe6f07e192 Extracting [>                                                  ]  131.1kB/12.41MB
 cb1ff4086f82 Extracting [========================================>          ]  13.76MB/16.84MB
 e6fe6f07e192 Extracting [=====>                                             ]  1.442MB/12.41MB
 cb1ff4086f82 Extracting [==================================================>]  16.84MB/16.84MB
 e6fe6f07e192 Extracting [============>                                      ]  3.015MB/12.41MB
 cb1ff4086f82 Pull complete 
 nginx Pulled 
 e6fe6f07e192 Extracting [====================>                              ]  5.112MB/12.41MB
 a976ed7e7808 Downloading [==================================================>]     574B/574B
 a976ed7e7808 Verifying Checksum 
 a976ed7e7808 Download complete 
 51a939567803 Downloading [>                                                  ]     12kB/1.116MB
 61a7421693bd Downloading [==================================================>]     969B/969B
 51a939567803 Verifying Checksum 
 51a939567803 Download complete 
 61a7421693bd Verifying Checksum 
 61a7421693bd Download complete 
 61a7421693bd Extracting [==================================================>]     969B/969B
 61a7421693bd Extracting [==================================================>]     969B/969B
 61a7421693bd Pull complete 
 51a939567803 Extracting [=>                                                 ]  32.77kB/1.116MB
 e6fe6f07e192 Extracting [==================================>                ]  8.651MB/12.41MB
 51a939567803 Extracting [==================================================>]  1.116MB/1.116MB
 51a939567803 Pull complete 
 e6fe6f07e192 Extracting [==========================================>        ]  10.62MB/12.41MB
 e6fe6f07e192 Extracting [==================================================>]  12.41MB/12.41MB
 e6fe6f07e192 Pull complete 
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 a2cadbfeca72 Pull complete 
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Pull complete 
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 a976ed7e7808 Extracting [==================================================>]     574B/574B
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
 6c13c55b4b82 Downloading [>                                                  ]  536.6kB/103.9MB
 6c13c55b4b82 Downloading [===>                                               ]  7.471MB/103.9MB
 6c13c55b4b82 Downloading [======>                                            ]  13.38MB/103.9MB
 0f940631c13f Downloading [=======>                                           ]  1.369kB/9.448kB
 0f940631c13f Downloading [==================================================>]  9.448kB/9.448kB
 0f940631c13f Verifying Checksum 
 0f940631c13f Download complete 
 6c13c55b4b82 Downloading [==========>                                        ]  20.82MB/103.9MB
 a15854d6fd91 Downloading [==================================================>]     129B/129B
 a15854d6fd91 Verifying Checksum 
 a15854d6fd91 Download complete 
 6c13c55b4b82 Downloading [==============>                                    ]  29.34MB/103.9MB
 6c13c55b4b82 Downloading [=================>                                 ]  37.34MB/103.9MB
 6c13c55b4b82 Downloading [======================>                            ]  45.87MB/103.9MB
 685be96195b7 Downloading [==================================================>]     171B/171B
 685be96195b7 Verifying Checksum 
 685be96195b7 Download complete 
 ce414b3fa674 Downloading [========>                                          ]  1.049kB/5.927kB
 ce414b3fa674 Downloading [==================================================>]  5.927kB/5.927kB
 ce414b3fa674 Verifying Checksum 
 ce414b3fa674 Download complete 
 6c13c55b4b82 Downloading [=========================>                         ]  53.33MB/103.9MB
 6c13c55b4b82 Downloading [============================>                      ]  60.27MB/103.9MB
 6c13c55b4b82 Downloading [================================>                  ]  66.68MB/103.9MB
 6afcd9ec0fd9 Downloading [==================================================>]     185B/185B
 6afcd9ec0fd9 Verifying Checksum 
 6afcd9ec0fd9 Download complete 
 6c13c55b4b82 Downloading [===================================>               ]   73.6MB/103.9MB
 6c13c55b4b82 Downloading [======================================>            ]  79.47MB/103.9MB
 6c13c55b4b82 Downloading [=========================================>         ]  86.92MB/103.9MB
 6c13c55b4b82 Downloading [=============================================>     ]  94.39MB/103.9MB
 6c13c55b4b82 Downloading [=================================================> ]  101.9MB/103.9MB
 6c13c55b4b82 Verifying Checksum 
 6c13c55b4b82 Download complete 
 6c13c55b4b82 Extracting [>                                                  ]  557.1kB/103.9MB
 6c13c55b4b82 Extracting [=>                                                 ]  2.228MB/103.9MB
 6c13c55b4b82 Extracting [==>                                                ]  5.014MB/103.9MB
 6c13c55b4b82 Extracting [====>                                              ]  8.913MB/103.9MB
 6c13c55b4b82 Extracting [======>                                            ]  12.81MB/103.9MB
 6c13c55b4b82 Extracting [========>                                          ]  16.71MB/103.9MB
 6c13c55b4b82 Extracting [=========>                                         ]  20.05MB/103.9MB
 6c13c55b4b82 Extracting [===========>                                       ]  23.95MB/103.9MB
 6c13c55b4b82 Extracting [=============>                                     ]  27.85MB/103.9MB
 6c13c55b4b82 Extracting [===============>                                   ]  31.75MB/103.9MB
 6c13c55b4b82 Extracting [=================>                                 ]  36.21MB/103.9MB
 6c13c55b4b82 Extracting [===================>                               ]  40.67MB/103.9MB
 6c13c55b4b82 Extracting [=====================>                             ]  45.12MB/103.9MB
 6c13c55b4b82 Extracting [=======================>                           ]  49.02MB/103.9MB
 6c13c55b4b82 Extracting [========================>                          ]  50.69MB/103.9MB
 6c13c55b4b82 Extracting [=========================>                         ]  52.36MB/103.9MB
 6c13c55b4b82 Extracting [==========================>                        ]  55.15MB/103.9MB
 6c13c55b4b82 Extracting [===========================>                       ]  57.93MB/103.9MB
 6c13c55b4b82 Extracting [=============================>                     ]  61.28MB/103.9MB
 6c13c55b4b82 Extracting [===============================>                   ]  65.18MB/103.9MB
 6c13c55b4b82 Extracting [================================>                  ]  67.96MB/103.9MB
 6c13c55b4b82 Extracting [==================================>                ]  70.75MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.09MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.65MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]   75.2MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]  76.87MB/103.9MB
 6c13c55b4b82 Extracting [=====================================>             ]  78.54MB/103.9MB
 6c13c55b4b82 Extracting [======================================>            ]  80.77MB/103.9MB
 6c13c55b4b82 Extracting [========================================>          ]  84.12MB/103.9MB
 6c13c55b4b82 Extracting [=========================================>         ]   86.9MB/103.9MB
 6c13c55b4b82 Extracting [==========================================>        ]  89.13MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]   90.8MB/103.9MB
 6c13c55b4b82 Extracting [=============================================>     ]   94.7MB/103.9MB
 6c13c55b4b82 Extracting [===============================================>   ]  99.16MB/103.9MB
 6c13c55b4b82 Extracting [=================================================> ]  101.9MB/103.9MB
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
#3 transferring dockerfile: 1.87kB 0.0s done
#3 WARN: FromAsCasing: 'as' and 'FROM' keywords' casing do not match (line 2)
#3 DONE 0.0s
#4 [frontend internal] load build definition from Dockerfile
#4 transferring dockerfile: 1.25kB 0.0s done
#4 DONE 0.1s
#5 [website internal] load build definition from Dockerfile
#5 transferring dockerfile: 2.04kB 0.0s done
#5 DONE 0.1s
#6 [backend internal] load metadata for docker.io/library/rust:1.89.0-alpine
#6 DONE 0.6s
#7 [agent internal] load metadata for docker.io/library/alpine:latest
#7 DONE 0.7s
#8 [website internal] load metadata for docker.io/library/node:18-alpine
#8 DONE 0.6s
#9 [agent internal] load .dockerignore
#9 transferring context: 2B done
#9 DONE 0.0s
#10 [backend internal] load metadata for docker.io/library/alpine:3.22
#10 DONE 0.7s
#11 [website internal] load .dockerignore
#11 transferring context: 2B done
#11 DONE 0.0s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 DONE 0.0s
#13 [agent stage-1 1/9] FROM docker.io/library/alpine:latest@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#13 DONE 0.0s
#14 [website base 1/1] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#14 DONE 0.0s
#15 [backend internal] load .dockerignore
#15 transferring context: 2B done
#15 DONE 0.0s
#16 [frontend internal] load metadata for docker.io/library/node:22-alpine
#16 DONE 0.7s
#17 [agent internal] load build context
#17 transferring context: 496B done
#17 DONE 0.0s
#18 [backend internal] load build context
#18 DONE 0.0s
#19 [website internal] load build context
#19 transferring context: 7.37kB done
#19 DONE 0.0s
#13 [backend stage-1 1/9] FROM docker.io/library/alpine:latest@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#13 DONE 0.0s
#20 [backend stage-1 1/7] FROM docker.io/library/alpine:3.22@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#20 DONE 0.0s
#21 [agent stage-1 3/9] RUN addgroup -g 1000 viworks &&     adduser -D -s /bin/bash -u 1000 -G viworks viworks
#21 CACHED
#22 [agent stage-1 5/9] COPY --from=builder /app/target/release/viworks-gateway-agent /usr/local/bin/
#22 CACHED
#23 [agent builder  5/10] RUN mkdir src && echo "fn main() {}" > src/main.rs
#23 CACHED
#24 [agent stage-1 6/9] COPY agent.toml /etc/viworks/
#24 CACHED
#25 [agent builder  9/10] RUN cargo build --release
#25 CACHED
#26 [agent stage-1 2/9] RUN apk update && apk add --no-cache     ca-certificates     libssl3     && rm -rf /var/cache/apk/*
#26 CACHED
#27 [agent stage-1 4/9] RUN mkdir -p /etc/viworks /var/log/viworks /usr/local/bin
#27 CACHED
#28 [agent stage-1 7/9] RUN chown -R viworks:viworks /etc/viworks /var/log/viworks
#28 CACHED
#29 [agent stage-1 8/9] RUN chmod +x /usr/local/bin/viworks-gateway-agent
#29 CACHED
#30 [agent builder  7/10] RUN rm src/main.rs
#30 CACHED
#31 [agent builder 10/10] RUN strip target/release/viworks-gateway-agent
#31 CACHED
#32 [agent builder  4/10] COPY Cargo.toml Cargo.lock ./
#32 CACHED
#33 [agent builder  3/10] WORKDIR /app
#33 CACHED
#34 [agent builder  8/10] COPY src/ ./src/
#34 CACHED
#35 [agent builder  6/10] RUN cargo build --release
#35 CACHED
#36 [agent builder  2/10] RUN apk update && apk add --no-cache     build-base     pkgconfig     openssl-dev     musl-dev     ca-certificates     && rm -rf /var/cache/apk/*
#36 CACHED
#37 [agent stage-1 9/9] RUN chmod 644 /etc/viworks/agent.toml
#37 CACHED
#38 [frontend internal] load .dockerignore
#38 transferring context: 2B done
#38 DONE 0.0s
#39 [agent] exporting to image
#39 exporting layers done
#39 writing image sha256:c72f3fb0a5146067e1440591134c67a46d7757775718b8a075a1596f8457d136 done
#39 naming to docker.io/library/digitaloceandocker-agent done
#39 DONE 0.0s
#40 [website deps 3/4] COPY package.json pnpm-lock.yaml* ./
#40 CACHED
#41 [website builder 1/5] WORKDIR /app
#41 CACHED
#42 [website builder 2/5] COPY --from=deps /app/node_modules ./node_modules
#42 CACHED
#43 [website runner 7/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#43 CACHED
#44 [website builder 5/5] RUN npm run build
#44 CACHED
#45 [website deps 1/4] RUN apk add --no-cache libc6-compat
#45 CACHED
#46 [website deps 2/4] WORKDIR /app
#46 CACHED
#47 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#47 CACHED
#48 [website builder 3/5] COPY . .
#48 CACHED
#49 [website runner 3/8] RUN adduser --system --uid 1001 nextjs
#49 CACHED
#50 [website builder 4/5] RUN mkdir -p public
#50 CACHED
#51 [website runner 6/8] RUN chown nextjs:nodejs .next
#51 CACHED
#52 [website runner 5/8] RUN mkdir .next
#52 CACHED
#53 [website runner 2/8] RUN addgroup --system --gid 1001 nodejs
#53 CACHED
#54 [website runner 4/8] COPY --from=builder /app/public ./public
#54 CACHED
#55 [frontend builder 1/6] FROM docker.io/library/node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9
#55 DONE 0.0s
#18 [backend internal] load build context
#18 transferring context: 1.69kB done
#18 DONE 0.0s
#56 [website runner 8/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#56 CACHED
#57 [backend builder  4/11] RUN rustup target add x86_64-unknown-linux-musl
#57 CACHED
#58 [backend builder  8/11] RUN rm src/main.rs
#58 CACHED
#59 [backend builder 10/11] COPY migrations ./migrations
#59 CACHED
#60 [backend builder  9/11] COPY src ./src
#60 CACHED
#61 [backend builder 11/11] RUN cargo build --release
#61 CACHED
#62 [backend builder  3/11] RUN apk add --no-cache     pkgconfig     openssl-dev     postgresql-dev     musl-dev     gcc     curl
#62 CACHED
#63 [backend builder  7/11] RUN cargo build --release
#63 CACHED
#64 [backend stage-1 4/7] COPY --from=builder /app/target/release/viworks-admin-backend /app/app
#64 CACHED
#65 [backend builder  2/11] WORKDIR /app
#65 CACHED
#66 [backend builder  5/11] COPY Cargo.toml Cargo.lock* ./
#66 CACHED
#67 [backend stage-1 6/7] COPY ops/entrypoint.sh /app/entrypoint.sh
#67 CACHED
#68 [backend stage-1 5/7] COPY --from=builder /app/migrations /app/migrations
#68 CACHED
#69 [backend stage-1 2/7] RUN apk add --no-cache     ca-certificates     dumb-init     busybox-extras     netcat-openbsd     wget     curl     tzdata     bash     postgresql-client     redis
#69 CACHED
#70 [backend builder  6/11] RUN mkdir src && echo "fn main() {}" > src/main.rs
#70 CACHED
#71 [backend stage-1 3/7] WORKDIR /app
#71 CACHED
#72 [backend stage-1 7/7] RUN adduser -D -u 10001 appuser &&     chown -R appuser:appuser /app &&     chmod +x /app/entrypoint.sh
#72 CACHED
#73 [frontend internal] load build context
#73 transferring context: 5.42kB done
#73 DONE 0.0s
#74 [website] exporting to image
#74 exporting layers done
#74 writing image sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a done
#74 naming to docker.io/library/digitaloceandocker-website done
#74 DONE 0.0s
#75 [agent] resolving provenance for metadata file
#75 DONE 0.0s
#76 [backend] exporting to image
#76 exporting layers done
#76 writing image sha256:e48fbc3b657cba6cae4eee23d960496857b0e131ee3680c6ed9147c51094554c done
#76 naming to docker.io/library/digitaloceandocker-backend 0.0s done
#76 DONE 0.0s
#77 [frontend runner 5/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#77 CACHED
#78 [frontend builder 3/6] COPY package*.json ./
#78 CACHED
#79 [frontend runner 4/7] WORKDIR /app
#79 CACHED
#80 [frontend builder 5/6] COPY . .
#80 CACHED
#81 [frontend builder 4/6] RUN npm install
#81 CACHED
#82 [frontend builder 2/6] WORKDIR /app
#82 CACHED
#83 [frontend runner 2/7] RUN apk add --no-cache dumb-init
#83 CACHED
#84 [frontend runner 6/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#84 CACHED
#85 [frontend runner 3/7] RUN addgroup -g 1001 -S nodejs &&     adduser -u 1001 -S nextjs -G nodejs
#85 CACHED
#86 [frontend builder 6/6] RUN npm run build
#86 CACHED
#87 [frontend runner 7/7] RUN mkdir -p ./public
#87 CACHED
#88 [frontend] exporting to image
#88 exporting layers done
#88 writing image sha256:5df242396420b99f980135e561ed081c939e3a76f937599d1f50f5dd9ca28d95
 digitaloceandocker-backend  Built
#88 writing image sha256:5df242396420b99f980135e561ed081c939e3a76f937599d1f50f5dd9ca28d95 done
 digitaloceandocker-frontend  Built
 digitaloceandocker-website  Built
 digitaloceandocker-agent  Built
#88 naming to docker.io/library/digitaloceandocker-frontend done
#88 DONE 0.0s
#89 [backend] resolving provenance for metadata file
#89 DONE 0.0s
#90 [website] resolving provenance for metadata file
#90 DONE 0.0s
#91 [frontend] resolving provenance for metadata file
#91 DONE 0.0s
 Container viworks-website  Creating
 Container viworks-agent  Creating
 Container viworks-postgres  Creating
 Container viworks-redis  Creating
 Container viworks-website  Created
 Container viworks-agent  Created
 Container viworks-redis  Created
 Container viworks-postgres  Created
 Container viworks-backend  Creating
 Container viworks-backend  Created
 Container viworks-frontend  Creating
 Container viworks-frontend  Created
 Container viworks-nginx  Creating
 Container viworks-nginx  Created
 Container viworks-agent  Starting
 Container viworks-postgres  Starting
 Container viworks-redis  Starting
 Container viworks-website  Starting
 Container viworks-postgres  Started
 Container viworks-website  Started
 Container viworks-agent  Started
 Container viworks-redis  Started
 Container viworks-redis  Waiting
 Container viworks-postgres  Waiting
 Container viworks-redis  Healthy
 Container viworks-postgres  Healthy
 Container viworks-backend  Starting
 Container viworks-backend  Started
 Container viworks-backend  Waiting
 Container viworks-backend  Healthy
 Container viworks-frontend  Starting
 Container viworks-frontend  Started
 Container viworks-nginx  Starting
 Container viworks-nginx  Started
⏳ Waiting for services to be ready...
✅ Services are starting up...
🔍 Checking individual service health...
🔍 Checking postgres health...
✅ postgres is healthy
🔍 Checking redis health...
✅ redis is healthy
🔍 Checking backend health...
✅ backend is healthy
🔍 Checking frontend health...
✅ frontend is healthy
🔍 Checking nginx health...
⏳ Waiting for nginx to be healthy... (1/30)
⏳ Waiting for nginx to be healthy... (2/30)
⏳ Waiting for nginx to be healthy... (3/30)
⏳ Waiting for nginx to be healthy... (4/30)
⏳ Waiting for nginx to be healthy... (5/30)
⏳ Waiting for nginx to be healthy... (6/30)
⏳ Waiting for nginx to be healthy... (7/30)
⏳ Waiting for nginx to be healthy... (8/30)
⏳ Waiting for nginx to be healthy... (9/30)
⏳ Waiting for nginx to be healthy... (10/30)
⏳ Waiting for nginx to be healthy... (11/30)
⏳ Waiting for nginx to be healthy... (12/30)
⏳ Waiting for nginx to be healthy... (13/30)
⏳ Waiting for nginx to be healthy... (14/30)
⏳ Waiting for nginx to be healthy... (15/30)
⏳ Waiting for nginx to be healthy... (16/30)
⏳ Waiting for nginx to be healthy... (17/30)
⏳ Waiting for nginx to be healthy... (18/30)
⏳ Waiting for nginx to be healthy... (19/30)
⏳ Waiting for nginx to be healthy... (20/30)
⏳ Waiting for nginx to be healthy... (21/30)
⏳ Waiting for nginx to be healthy... (22/30)
⏳ Waiting for nginx to be healthy... (23/30)
⏳ Waiting for nginx to be healthy... (24/30)
⏳ Waiting for nginx to be healthy... (25/30)
⏳ Waiting for nginx to be healthy... (26/30)
⏳ Waiting for nginx to be healthy... (27/30)
⏳ Waiting for nginx to be healthy... (28/30)
⏳ Waiting for nginx to be healthy... (29/30)
⏳ Waiting for nginx to be healthy... (30/30)
❌ nginx failed to become healthy
⚠️  Nginx not found (may be running separately)
📊 Checking service status...
NAME               IMAGE                         COMMAND                  SERVICE    CREATED         STATUS                            PORTS
viworks-agent      digitaloceandocker-agent      "/usr/local/bin/viwo…"   agent      2 minutes ago   Restarting (0) 2 seconds ago      
viworks-backend    digitaloceandocker-backend    "/usr/bin/dumb-init …"   backend    2 minutes ago   Up 2 minutes (healthy)            
viworks-frontend   digitaloceandocker-frontend   "dumb-init -- node s…"   frontend   2 minutes ago   Up 2 minutes (health: starting)   
viworks-nginx      nginx:alpine                  "/docker-entrypoint.…"   nginx      2 minutes ago   Restarting (1) 48 seconds ago     
viworks-postgres   postgres:15-alpine            "docker-entrypoint.s…"   postgres   2 minutes ago   Up 2 minutes (healthy)            
viworks-redis      redis:7-alpine                "docker-entrypoint.s…"   redis      2 minutes ago   Up 2 minutes (healthy)            
viworks-website    digitaloceandocker-website    "docker-entrypoint.s…"   website    2 minutes ago   Up 2 minutes (health: starting)   
🧪 Testing endpoints through nginx proxy...
Testing http://localhost:3000...
⏳ http://localhost:3000 not ready yet... (1/10)
⏳ http://localhost:3000 not ready yet... (2/10)
⏳ http://localhost:3000 not ready yet... (3/10)
⏳ http://localhost:3000 not ready yet... (4/10)
⏳ http://localhost:3000 not ready yet... (5/10)
⏳ http://localhost:3000 not ready yet... (6/10)
⏳ http://localhost:3000 not ready yet... (7/10)
⏳ http://localhost:3000 not ready yet... (8/10)
⏳ http://localhost:3000 not ready yet... (9/10)
⏳ http://localhost:3000 not ready yet... (10/10)
