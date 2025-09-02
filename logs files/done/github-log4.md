deploy
Started 10m 3s ago

1s
1s
1s
2s
0s
7m 31s
Run scp -i ~/.ssh/id_ed25519 deploy.sh ${DROPLET_USER}@${DROPLET_IP}:/tmp/
🚀 Starting ViWorks Automated Deployment...
📅 Deployment started at: Tue Sep  2 06:44:44 UTC 2025
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
 Container viworks-frontend  Stopped
 Container viworks-frontend  Removing
 Container viworks-agent  Removed
 Container viworks-frontend  Removed
 Container viworks-backend  Stopping
 Container viworks-backend  Stopped
 Container viworks-backend  Removing
 Container viworks-backend  Removed
 Container viworks-postgres  Stopping
 Container viworks-redis  Stopping
 Container viworks-website  Stopped
 Container viworks-website  Removing
 Container viworks-website  Removed
 Container viworks-postgres  Stopped
 Container viworks-postgres  Removing
 Container viworks-redis  Stopped
 Container viworks-redis  Removing
 Container viworks-postgres  Removed
 Container viworks-redis  Removed
🛑 Force stopping any running containers...
🧹 Removing containers with specific names...
🧹 Removing orphaned containers...
time="2025-09-02T06:44:45Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
🧹 Cleaning up Docker images...
Total reclaimed space: 0B
Deleted Images:
untagged: digitaloceandocker-website:latest
deleted: sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a
untagged: digitaloceandocker-backend:latest
deleted: sha256:676719744fa999f1783137f35f989f7eac894f1e93e88cdb3c7c35e7e27a0957
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
untagged: digitaloceandocker-agent:latest
deleted: sha256:c72f3fb0a5146067e1440591134c67a46d7757775718b8a075a1596f8457d136
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
   9bf87e2..73d5a64  main       -> origin/main
HEAD is now at 73d5a64 FIX: Backend health check configuration
🌐 Setting up two-network security architecture...
8658d5260f1a9c91a43ea6587f7565bb194923e1c95bc10177fd4fcc76ee18dd
f7db34f512ac567268bd195915a119343d509cc78e6bb4ef8c2e98c3bc2f0197
🔨 Building and starting new containers with two-network security...
 redis Pulling 
 nginx Pulling 
 postgres Pulling 
 0368fd46e3c6 Pulling fs layer 
 4c55286bbede Pulling fs layer 
 5e28347af205 Pulling fs layer 
 311eca34042e Pulling fs layer 
 e6fe6f07e192 Pulling fs layer 
 a2cadbfeca72 Pulling fs layer 
 4f4fb700ef54 Pulling fs layer 
 a976ed7e7808 Pulling fs layer 
 311eca34042e Waiting 
 e6fe6f07e192 Waiting 
 a2cadbfeca72 Waiting 
 4f4fb700ef54 Waiting 
 a976ed7e7808 Waiting 
 9824c27679d3 Already exists 
 6bc572a340ec Pulling fs layer 
 403e3f251637 Pulling fs layer 
 9adfbae99cb7 Pulling fs layer 
 7a8a46741e18 Pulling fs layer 
 c9ebe2ff2d2c Pulling fs layer 
 a992fbc61ecc Pulling fs layer 
 cb1ff4086f82 Pulling fs layer 
 6bc572a340ec Waiting 
 403e3f251637 Waiting 
 9adfbae99cb7 Waiting 
 7a8a46741e18 Waiting 
 c9ebe2ff2d2c Waiting 
 a992fbc61ecc Waiting 
 cb1ff4086f82 Waiting 
 9824c27679d3 Already exists 
 61a7421693bd Pulling fs layer 
 51a939567803 Pulling fs layer 
 a612d38c9b48 Pulling fs layer 
 61a7421693bd Waiting 
 51a939567803 Waiting 
 901a9540064a Pulling fs layer 
 6c13c55b4b82 Pulling fs layer 
 0f940631c13f Pulling fs layer 
 a15854d6fd91 Pulling fs layer 
 685be96195b7 Pulling fs layer 
 ce414b3fa674 Pulling fs layer 
 6afcd9ec0fd9 Pulling fs layer 
 901a9540064a Waiting 
 6c13c55b4b82 Waiting 
 0f940631c13f Waiting 
 a15854d6fd91 Waiting 
 685be96195b7 Waiting 
 ce414b3fa674 Waiting 
 6afcd9ec0fd9 Waiting 
 a612d38c9b48 Waiting 
 4c55286bbede Downloading [==================================================>]     950B/950B
 4c55286bbede Verifying Checksum 
 4c55286bbede Download complete 
 5e28347af205 Downloading [>                                                  ]  2.738kB/173.2kB
 5e28347af205 Verifying Checksum 
 5e28347af205 Download complete 
 0368fd46e3c6 Downloading [>                                                  ]  36.88kB/3.638MB
 0368fd46e3c6 Verifying Checksum 
 0368fd46e3c6 Download complete 
 0368fd46e3c6 Extracting [>                                                  ]  65.54kB/3.638MB
 0368fd46e3c6 Extracting [==============================>                    ]  2.228MB/3.638MB
 0368fd46e3c6 Extracting [==================================================>]  3.638MB/3.638MB
 0368fd46e3c6 Pull complete 
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Pull complete 
 5e28347af205 Extracting [=========>                                         ]  32.77kB/173.2kB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 311eca34042e Downloading [>                                                  ]  10.63kB/1.003MB
 311eca34042e Downloading [==================================================>]  1.003MB/1.003MB
 311eca34042e Verifying Checksum 
 311eca34042e Download complete 
 e6fe6f07e192 Downloading [>                                                  ]  127.9kB/12.41MB
 a2cadbfeca72 Downloading [==================================================>]      99B/99B
 a2cadbfeca72 Verifying Checksum 
 a2cadbfeca72 Download complete 
 5e28347af205 Pull complete 
 311eca34042e Extracting [=>                                                 ]  32.77kB/1.003MB
 e6fe6f07e192 Downloading [===========================>                       ]  6.939MB/12.41MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 311eca34042e Pull complete 
 e6fe6f07e192 Downloading [================================================>  ]  12.05MB/12.41MB
 e6fe6f07e192 Verifying Checksum 
 e6fe6f07e192 Download complete 
 e6fe6f07e192 Extracting [>                                                  ]  131.1kB/12.41MB
 e6fe6f07e192 Extracting [=========>                                         ]  2.359MB/12.41MB
 4f4fb700ef54 Downloading [==================================================>]      32B/32B
 4f4fb700ef54 Verifying Checksum 
 e6fe6f07e192 Extracting [=====================>                             ]  5.243MB/12.41MB
 a976ed7e7808 Downloading [==================================================>]     574B/574B
 a976ed7e7808 Verifying Checksum 
 a976ed7e7808 Download complete 
 e6fe6f07e192 Extracting [================================>                  ]  8.126MB/12.41MB
 e6fe6f07e192 Extracting [===========================================>       ]  10.88MB/12.41MB
 6bc572a340ec Downloading [>                                                  ]  18.84kB/1.806MB
 6bc572a340ec Verifying Checksum 
 6bc572a340ec Download complete 
 6bc572a340ec Extracting [>                                                  ]  32.77kB/1.806MB
 e6fe6f07e192 Extracting [==================================================>]  12.41MB/12.41MB
 e6fe6f07e192 Pull complete 
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 403e3f251637 Downloading [==================================================>]     628B/628B
 403e3f251637 Download complete 
 6bc572a340ec Extracting [====================================>              ]  1.311MB/1.806MB
 a2cadbfeca72 Pull complete 
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Pull complete 
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 6bc572a340ec Extracting [==================================================>]  1.806MB/1.806MB
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 9adfbae99cb7 Downloading [==================================================>]     955B/955B
 9adfbae99cb7 Verifying Checksum 
 9adfbae99cb7 Download complete 
 a976ed7e7808 Pull complete 
 redis Pulled 
 6bc572a340ec Pull complete 
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Pull complete 
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Pull complete 
 7a8a46741e18 Downloading [==================================================>]     405B/405B
 7a8a46741e18 Download complete 
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 7a8a46741e18 Pull complete 
 c9ebe2ff2d2c Downloading [===========================================>       ]  1.049kB/1.209kB
 c9ebe2ff2d2c Downloading [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Verifying Checksum 
 c9ebe2ff2d2c Download complete 
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Pull complete 
 a992fbc61ecc Downloading [=====================================>             ]  1.049kB/1.398kB
 a992fbc61ecc Downloading [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Verifying Checksum 
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Pull complete 
 cb1ff4086f82 Downloading [>                                                  ]  171.9kB/16.84MB
 61a7421693bd Downloading [==================================================>]     969B/969B
 61a7421693bd Verifying Checksum 
 61a7421693bd Download complete 
 61a7421693bd Extracting [==================================================>]     969B/969B
 61a7421693bd Extracting [==================================================>]     969B/969B
 cb1ff4086f82 Downloading [============================>                      ]  9.724MB/16.84MB
 61a7421693bd Pull complete 
 51a939567803 Downloading [>                                                  ]  12.32kB/1.116MB
 51a939567803 Verifying Checksum 
 51a939567803 Download complete 
 51a939567803 Extracting [=>                                                 ]  32.77kB/1.116MB
 cb1ff4086f82 Downloading [===============================================>   ]  15.89MB/16.84MB
 cb1ff4086f82 Verifying Checksum 
 cb1ff4086f82 Download complete 
 cb1ff4086f82 Extracting [>                                                  ]  196.6kB/16.84MB
 51a939567803 Extracting [==================================================>]  1.116MB/1.116MB
 51a939567803 Pull complete 
 cb1ff4086f82 Extracting [====>                                              ]  1.376MB/16.84MB
 cb1ff4086f82 Extracting [==============>                                    ]  4.719MB/16.84MB
 a612d38c9b48 Downloading [==================================================>]     175B/175B
 a612d38c9b48 Verifying Checksum 
 a612d38c9b48 Download complete 
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 a612d38c9b48 Pull complete 
 cb1ff4086f82 Extracting [=====================>                             ]  7.274MB/16.84MB
 901a9540064a Downloading [==================================================>]     116B/116B
 901a9540064a Verifying Checksum 
 901a9540064a Download complete 
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Pull complete 
 6c13c55b4b82 Downloading [>                                                  ]  540.7kB/103.9MB
 cb1ff4086f82 Extracting [============================>                      ]  9.634MB/16.84MB
 6c13c55b4b82 Downloading [====>                                              ]  9.073MB/103.9MB
 cb1ff4086f82 Extracting [=================================>                 ]  11.21MB/16.84MB
 6c13c55b4b82 Downloading [=======>                                           ]  16.51MB/103.9MB
 cb1ff4086f82 Extracting [=====================================>             ]  12.78MB/16.84MB
 0f940631c13f Downloading [=====>                                             ]  1.049kB/9.448kB
 0f940631c13f Downloading [==================================================>]  9.448kB/9.448kB
 0f940631c13f Verifying Checksum 
 0f940631c13f Download complete 
 6c13c55b4b82 Downloading [===========>                                       ]  24.51MB/103.9MB
 a15854d6fd91 Downloading [==================================================>]     129B/129B
 a15854d6fd91 Verifying Checksum 
 a15854d6fd91 Download complete 
 cb1ff4086f82 Extracting [============================================>      ]  14.94MB/16.84MB
 6c13c55b4b82 Downloading [================>                                  ]   33.6MB/103.9MB
 6c13c55b4b82 Downloading [====================>                              ]  41.63MB/103.9MB
 cb1ff4086f82 Extracting [==================================================>]  16.84MB/16.84MB
 cb1ff4086f82 Pull complete 
 6c13c55b4b82 Downloading [========================>                          ]  51.27MB/103.9MB
 nginx Pulled 
 6c13c55b4b82 Downloading [=============================>                     ]  61.97MB/103.9MB
 685be96195b7 Downloading [==================================================>]     171B/171B
 685be96195b7 Verifying Checksum 
 685be96195b7 Download complete 
 ce414b3fa674 Downloading [========>                                          ]  1.049kB/5.927kB
 ce414b3fa674 Downloading [==================================================>]  5.927kB/5.927kB
 ce414b3fa674 Verifying Checksum 
 ce414b3fa674 Download complete 
 6c13c55b4b82 Downloading [==================================>                ]  72.11MB/103.9MB
 6c13c55b4b82 Downloading [=======================================>           ]  82.24MB/103.9MB
 6c13c55b4b82 Downloading [============================================>      ]  92.88MB/103.9MB
 6afcd9ec0fd9 Downloading [==================================================>]     185B/185B
 6afcd9ec0fd9 Verifying Checksum 
 6afcd9ec0fd9 Download complete 
 6c13c55b4b82 Downloading [=================================================> ]  101.9MB/103.9MB
 6c13c55b4b82 Verifying Checksum 
 6c13c55b4b82 Download complete 
 6c13c55b4b82 Extracting [>                                                  ]  557.1kB/103.9MB
 6c13c55b4b82 Extracting [=>                                                 ]  2.228MB/103.9MB
 6c13c55b4b82 Extracting [==>                                                ]  5.014MB/103.9MB
 6c13c55b4b82 Extracting [====>                                              ]  8.356MB/103.9MB
 6c13c55b4b82 Extracting [=====>                                             ]   11.7MB/103.9MB
 6c13c55b4b82 Extracting [=======>                                           ]  15.04MB/103.9MB
 6c13c55b4b82 Extracting [========>                                          ]  18.38MB/103.9MB
 6c13c55b4b82 Extracting [==========>                                        ]  22.28MB/103.9MB
 6c13c55b4b82 Extracting [============>                                      ]  26.18MB/103.9MB
 6c13c55b4b82 Extracting [=============>                                     ]  28.97MB/103.9MB
 6c13c55b4b82 Extracting [===============>                                   ]  31.75MB/103.9MB
 6c13c55b4b82 Extracting [================>                                  ]  34.54MB/103.9MB
 6c13c55b4b82 Extracting [==================>                                ]  37.88MB/103.9MB
 6c13c55b4b82 Extracting [===================>                               ]  41.22MB/103.9MB
 6c13c55b4b82 Extracting [=====================>                             ]  45.12MB/103.9MB
 6c13c55b4b82 Extracting [=======================>                           ]  48.46MB/103.9MB
 6c13c55b4b82 Extracting [========================>                          ]  50.69MB/103.9MB
 6c13c55b4b82 Extracting [=========================>                         ]  52.92MB/103.9MB
 6c13c55b4b82 Extracting [==========================>                        ]  55.15MB/103.9MB
 6c13c55b4b82 Extracting [===========================>                       ]  57.38MB/103.9MB
 6c13c55b4b82 Extracting [============================>                      ]  60.16MB/103.9MB
 6c13c55b4b82 Extracting [==============================>                    ]  62.39MB/103.9MB
 6c13c55b4b82 Extracting [===============================>                   ]  65.18MB/103.9MB
 6c13c55b4b82 Extracting [================================>                  ]  67.96MB/103.9MB
 6c13c55b4b82 Extracting [==================================>                ]   71.3MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.65MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]   75.2MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]  76.32MB/103.9MB
 6c13c55b4b82 Extracting [=====================================>             ]  77.99MB/103.9MB
 6c13c55b4b82 Extracting [======================================>            ]  80.77MB/103.9MB
 6c13c55b4b82 Extracting [=======================================>           ]     83MB/103.9MB
 6c13c55b4b82 Extracting [=========================================>         ]  85.23MB/103.9MB
 6c13c55b4b82 Extracting [==========================================>        ]  88.57MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]   90.8MB/103.9MB
 6c13c55b4b82 Extracting [=============================================>     ]  94.14MB/103.9MB
 6c13c55b4b82 Extracting [==============================================>    ]  97.48MB/103.9MB
 6c13c55b4b82 Extracting [================================================>  ]  100.8MB/103.9MB
 6c13c55b4b82 Extracting [=================================================> ]  103.6MB/103.9MB
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

#2 [website internal] load build definition from Dockerfile
#2 DONE 0.0s

#3 [agent internal] load build definition from Dockerfile.alpine-production
#3 transferring dockerfile: 1.79kB done
#3 WARN: FromAsCasing: 'as' and 'FROM' keywords' casing do not match (line 2)
#3 DONE 0.0s

#2 [website internal] load build definition from Dockerfile
#2 transferring dockerfile: 2.04kB done
#2 DONE 0.0s

#4 [frontend internal] load build definition from Dockerfile
#4 transferring dockerfile: 1.25kB done
#4 DONE 0.0s

#5 [backend internal] load build definition from Dockerfile.fixed
#5 transferring dockerfile: 1.87kB done
#5 WARN: FromAsCasing: 'as' and 'FROM' keywords' casing do not match (line 2)
#5 DONE 0.1s

#6 [backend internal] load metadata for docker.io/library/rust:1.89.0-alpine
#6 ...

#7 [agent internal] load metadata for docker.io/library/alpine:latest
#7 DONE 0.6s

#8 [backend internal] load metadata for docker.io/library/alpine:3.22
#8 DONE 0.6s

#9 [website internal] load metadata for docker.io/library/node:18-alpine
#9 DONE 0.7s

#10 [website internal] load .dockerignore
#10 transferring context:
#10 transferring context: 2B done
#10 DONE 0.0s

#6 [agent internal] load metadata for docker.io/library/rust:1.89.0-alpine
#6 DONE 0.7s

#11 [website base 1/1] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#11 DONE 0.0s

#12 [agent internal] load .dockerignore
#12 transferring context: 2B done
#12 DONE 0.0s

#13 [frontend internal] load metadata for docker.io/library/node:22-alpine
#13 DONE 0.7s

#14 [backend internal] load .dockerignore
#14 transferring context: 2B done
#14 DONE 0.0s

#15 [website internal] load build context
#15 transferring context: 7.37kB 0.0s done
#15 DONE 0.0s

#16 [agent stage-1 1/9] FROM docker.io/library/alpine:latest@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#16 DONE 0.0s

#17 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#17 DONE 0.0s

#18 [frontend internal] load .dockerignore
#18 transferring context: 2B done
#18 DONE 0.0s

#19 [agent internal] load build context
#19 transferring context: 496B 0.0s done
#19 DONE 0.0s

#16 [backend stage-1 1/9] FROM docker.io/library/alpine:latest@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#16 DONE 0.0s

#20 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#20 CACHED

#21 [website builder 3/5] COPY . .
#21 CACHED

#22 [website runner 4/8] COPY --from=builder /app/public ./public
#22 CACHED

#23 [website runner 3/8] RUN adduser --system --uid 1001 nextjs
#23 CACHED

#24 [website runner 2/8] RUN addgroup --system --gid 1001 nodejs
#24 CACHED

#25 [website runner 5/8] RUN mkdir .next
#25 CACHED

#26 [website deps 3/4] COPY package.json pnpm-lock.yaml* ./
#26 CACHED

#27 [website builder 2/5] COPY --from=deps /app/node_modules ./node_modules
#27 CACHED

#28 [website deps 1/4] RUN apk add --no-cache libc6-compat
#28 CACHED

#29 [website deps 2/4] WORKDIR /app
#29 CACHED

#30 [website builder 1/5] WORKDIR /app
#30 CACHED

#31 [website runner 7/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#31 CACHED

#32 [website builder 5/5] RUN npm run build
#32 CACHED

#33 [website builder 4/5] RUN mkdir -p public
#33 CACHED

#34 [website runner 6/8] RUN chown nextjs:nodejs .next
#34 CACHED

#35 [website runner 8/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#35 CACHED

#36 [backend stage-1 1/7] FROM docker.io/library/alpine:3.22@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#36 DONE 0.0s

#37 [frontend builder 1/6] FROM docker.io/library/node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9
#37 DONE 0.0s

#38 [agent stage-1 7/9] RUN chown -R viworks:viworks /etc/viworks /var/log/viworks
#38 CACHED

#39 [agent builder  2/10] RUN apk update && apk add --no-cache     build-base     pkgconfig     openssl-dev     musl-dev     ca-certificates     && rm -rf /var/cache/apk/*
#39 CACHED

#40 [agent builder  4/10] COPY Cargo.toml Cargo.lock ./
#40 CACHED

#41 [agent builder  7/10] RUN rm src/main.rs
#41 CACHED

#42 [agent builder  8/10] COPY src/ ./src/
#42 CACHED

#43 [agent stage-1 8/9] RUN chmod +x /usr/local/bin/viworks-gateway-agent
#43 CACHED

#44 [agent builder  9/10] RUN cargo build --release
#44 CACHED

#45 [agent stage-1 4/9] RUN mkdir -p /etc/viworks /var/log/viworks /usr/local/bin
#45 CACHED

#46 [agent builder 10/10] RUN strip target/release/viworks-gateway-agent
#46 CACHED

#47 [agent builder  3/10] WORKDIR /app
#47 CACHED

#48 [agent builder  6/10] RUN cargo build --release
#48 CACHED

#49 [agent stage-1 5/9] COPY --from=builder /app/target/release/viworks-gateway-agent /usr/local/bin/
#49 CACHED

#50 [agent stage-1 3/9] RUN addgroup -g 1000 viworks &&     adduser -D -s /bin/bash -u 1000 -G viworks viworks
#50 CACHED

#51 [agent stage-1 2/9] RUN apk update && apk add --no-cache     ca-certificates     libssl3     && rm -rf /var/cache/apk/*
#51 CACHED

#52 [agent stage-1 6/9] COPY agent.toml /etc/viworks/
#52 CACHED

#53 [agent builder  5/10] RUN mkdir src && echo "fn main() {}" > src/main.rs
#53 CACHED

#54 [agent stage-1 9/9] RUN chmod 644 /etc/viworks/agent.toml
#54 CACHED

#55 [backend internal] load build context
#55 transferring context: 10.71kB done
#55 DONE 0.0s

#56 [website] exporting to image
#56 exporting layers done
#56 writing image sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a done
#56 naming to docker.io/library/digitaloceandocker-website done
#56 DONE 0.0s

#57 [backend builder  2/11] WORKDIR /app
#57 CACHED

#58 [backend builder  3/11] RUN apk add --no-cache     pkgconfig     openssl-dev     postgresql-dev     musl-dev     gcc     curl
#58 CACHED

#59 [backend builder  5/11] COPY Cargo.toml Cargo.lock* ./
#59 CACHED

#60 [backend builder  7/11] RUN cargo build --release
#60 CACHED

#61 [backend builder  6/11] RUN mkdir src && echo "fn main() {}" > src/main.rs
#61 CACHED

#62 [backend builder  4/11] RUN rustup target add x86_64-unknown-linux-musl
#62 CACHED

#63 [backend builder  8/11] RUN rm src/main.rs
#63 CACHED

#64 [frontend internal] load build context
#64 transferring context: 5.42kB 0.0s done
#64 DONE 0.0s

#65 [frontend runner 6/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#65 CACHED

#66 [frontend builder 3/6] COPY package*.json ./
#66 CACHED

#67 [frontend runner 2/7] RUN apk add --no-cache dumb-init
#67 CACHED

#68 [frontend runner 5/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#68 CACHED

#69 [frontend builder 5/6] COPY . .
#69 CACHED

#70 [frontend runner 4/7] WORKDIR /app
#70 CACHED

#71 [frontend builder 4/6] RUN npm install
#71 CACHED

#72 [frontend builder 6/6] RUN npm run build
#72 CACHED

#73 [frontend builder 2/6] WORKDIR /app
#73 CACHED

#74 [frontend runner 3/7] RUN addgroup -g 1001 -S nodejs &&     adduser -u 1001 -S nextjs -G nodejs
#74 CACHED

#75 [frontend runner 7/7] RUN mkdir -p ./public
#75 CACHED

#76 [agent] exporting to image
#76 exporting layers done
#76 writing image sha256:c72f3fb0a5146067e1440591134c67a46d7757775718b8a075a1596f8457d136 0.0s done
#76 naming to docker.io/library/digitaloceandocker-agent done
#76 DONE 0.1s

#77 [frontend] exporting to image
#77 exporting layers done
#77 writing image sha256:5df242396420b99f980135e561ed081c939e3a76f937599d1f50f5dd9ca28d95
#77 writing image sha256:5df242396420b99f980135e561ed081c939e3a76f937599d1f50f5dd9ca28d95 0.0s done
#77 naming to docker.io/library/digitaloceandocker-frontend done
#77 DONE 0.1s

#78 [backend builder  9/11] COPY src ./src
#78 DONE 0.6s

#79 [website] resolving provenance for metadata file
#79 DONE 0.0s

#80 [agent] resolving provenance for metadata file
#80 DONE 0.0s

#81 [frontend] resolving provenance for metadata file
#81 DONE 0.0s

#82 [backend builder 10/11] COPY migrations ./migrations
#82 DONE 0.1s

#83 [backend builder 11/11] RUN cargo build --release
#83 0.758    Compiling viworks-admin-backend v0.1.0 (/app)
#83 110.1     Finished `release` profile [optimized] target(s) in 1m 49s
#83 110.1 warning: the following packages contain code that will be rejected by a future version of Rust: redis v0.24.0
#83 110.1 note: to see what the problems were, use the option `--future-incompat-report`, or run `cargo report future-incompatibilities --id 1`
#83 DONE 110.2s

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
#90 exporting layers
#90 exporting layers 0.2s done
#90 writing image sha256:e48fbc3b657cba6cae4eee23d960496857b0e131ee3680c6ed9147c51094554c done
 digitaloceandocker-backend  Built
 digitaloceandocker-frontend  Built
 digitaloceandocker-website  Built
 digitaloceandocker-agent  Built
#90 naming to docker.io/library/digitaloceandocker-backend done
#90 DONE 0.2s

#91 [backend] resolving provenance for metadata file
#91 DONE 0.0s
 Container viworks-redis  Creating
 Container viworks-agent  Creating
 Container viworks-postgres  Creating
 Container viworks-website  Creating
 Container viworks-postgres  Created
 Container viworks-website  Created
 Container viworks-redis  Created
 Container viworks-backend  Creating
 Container viworks-agent  Created
 Container viworks-backend  Created
 Container viworks-frontend  Creating
 Container viworks-frontend  Created
 Container viworks-nginx  Creating
 Container viworks-nginx  Created
 Container viworks-website  Starting
 Container viworks-agent  Starting
 Container viworks-postgres  Starting
 Container viworks-redis  Starting
 Container viworks-redis  Started
 Container viworks-website  Started
 Container viworks-postgres  Started
 Container viworks-postgres  Waiting
 Container viworks-redis  Waiting
 Container viworks-agent  Started
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
NAME               IMAGE                         COMMAND                  SERVICE    CREATED         STATUS                          PORTS
viworks-agent      digitaloceandocker-agent      "/usr/local/bin/viwo…"   agent      2 minutes ago   Restarting (0) 2 seconds ago    
viworks-backend    digitaloceandocker-backend    "/usr/bin/dumb-init …"   backend    2 minutes ago   Up 2 minutes (healthy)          
viworks-frontend   digitaloceandocker-frontend   "dumb-init -- node s…"   frontend   2 minutes ago   Up 2 minutes (unhealthy)        
viworks-nginx      nginx:alpine                  "/docker-entrypoint.…"   nginx      2 minutes ago   Restarting (1) 48 seconds ago   
viworks-postgres   postgres:15-alpine            "docker-entrypoint.s…"   postgres   2 minutes ago   Up 2 minutes (healthy)          
viworks-redis      redis:7-alpine                "docker-entrypoint.s…"   redis      2 minutes ago   Up 2 minutes (healthy)          
viworks-website    digitaloceandocker-website    "docker-entrypoint.s…"   website    2 minutes ago   Up 2 minutes (unhealthy)        
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
Testing http://localhost:8081/health...
⏳ http://localhost:8081/health not ready yet... (1/10)
⏳ http://localhost:8081/health not ready yet... (2/10)
⏳ http://localhost:8081/health not ready yet... (3/10)
⏳ http://localhost:8081/health not ready yet... (4/10)
⏳ http://localhost:8081/health not ready yet... (5/10)
⏳ http://localhost:8081/health not ready yet... (6/10)
⏳ http://localhost:8081/health not ready yet... (7/10)
⏳ http://localhost:8081/health not ready yet... (8/10)
⏳ http://localhost:8081/health not ready yet... (9/10)
⏳ http://localhost:8081/health not ready yet... (10/10)
🧪 Testing nginx proxy endpoints...
Testing nginx proxy...
⏳ Nginx not ready yet... (1/10)
⏳ Nginx not ready yet... (2/10)
⏳ Nginx not ready yet... (3/10)
⏳ Nginx not ready yet... (4/10)
⏳ Nginx not ready yet... (5/10)
⏳ Nginx not ready yet... (6/10)
⏳ Nginx not ready yet... (7/10)
⏳ Nginx not ready yet... (8/10)
⏳ Nginx not ready yet... (9/10)
⏳ Nginx not ready yet... (10/10)
🔍 Running backend-specific tests...
Testing database connection...
postgres:5432 - accepting connections
✅ Database connection OK
Testing Redis connection...
PONG
✅ Redis connection OK
Testing backend API endpoints...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
❌ Backend health check failed

  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
curl: (7) Failed to connect to localhost port 8081 after 4 ms: Connection refused
📊 Checking resource usage...
No viworks containers found

📋 Recent logs (last 20 lines each):
Backend logs:
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:174: ERROR:  trigger "update_policies_updated_at" for relation "policies" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:184: ERROR:  duplicate key value violates unique constraint "users_username_key"
viworks-backend  | DETAIL:  Key (username)=(admin) already exists.
viworks-backend  | INSERT 0 1
viworks-backend  | 2025-09-02 06:46:57. | ✅ Migration 001_initial_schema.sql completed successfully
viworks-backend  | 2025-09-02 06:46:57. | ✅ All database migrations completed successfully
viworks-backend  | 2025-09-02 06:46:57. | 🚀 Launching application...
viworks-backend  | 2025-09-02 06:46:57. | 📊 Binary size: 5.8M
viworks-backend  | 2025-09-02 06:46:57. | 📊 Binary permissions: -rwxr-xr-x    1 appuser  appuser    6025576 Sep  2 06:46 /app/app
viworks-backend  | 🚀 Starting ViWorkS Admin Backend (Minimal)...
viworks-backend  | 🔧 Environment Configuration:
viworks-backend  |   HOST: 0.0.0.0
viworks-backend  |   PORT: 8081
viworks-backend  |   RUST_LOG: info
viworks-backend  | 🌐 Starting HTTP server on 0.0.0.0:8081...
viworks-backend  | ✅ HTTP server bound successfully
viworks-backend  | 🚀 Server is now running and accepting connections
viworks-backend  | [2025-09-02T06:46:57Z INFO  actix_server::builder] starting 2 workers
viworks-backend  | [2025-09-02T06:46:57Z INFO  actix_server::server] Actix runtime found; starting in Actix runtime
viworks-backend  | [2025-09-02T06:46:57Z INFO  actix_server::server] starting service: "actix-web-service-0.0.0.0:8081", workers: 2, listening on: 0.0.0.0:8081

PostgreSQL logs:
viworks-postgres  | 2025-09-02 06:46:57.000 UTC [41] ERROR:  relation "idx_otp_challenges_user_id" already exists
viworks-postgres  | 2025-09-02 06:46:57.000 UTC [41] STATEMENT:  CREATE INDEX idx_otp_challenges_user_id ON otp_challenges(user_id);
viworks-postgres  | 2025-09-02 06:46:57.000 UTC [41] ERROR:  relation "idx_otp_challenges_expires_at" already exists
viworks-postgres  | 2025-09-02 06:46:57.000 UTC [41] STATEMENT:  CREATE INDEX idx_otp_challenges_expires_at ON otp_challenges(expires_at);
viworks-postgres  | 2025-09-02 06:46:57.012 UTC [41] ERROR:  trigger "update_users_updated_at" for relation "users" already exists
viworks-postgres  | 2025-09-02 06:46:57.012 UTC [41] STATEMENT:  CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
viworks-postgres  | 2025-09-02 06:46:57.013 UTC [41] ERROR:  trigger "update_policies_updated_at" for relation "policies" already exists
viworks-postgres  | 2025-09-02 06:46:57.013 UTC [41] STATEMENT:  CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
viworks-postgres  | 2025-09-02 06:46:57.018 UTC [41] ERROR:  duplicate key value violates unique constraint "users_username_key"
viworks-postgres  | 2025-09-02 06:46:57.018 UTC [41] DETAIL:  Key (username)=(admin) already exists.
viworks-postgres  | 2025-09-02 06:46:57.018 UTC [41] STATEMENT:  INSERT INTO users (username, email, password_hash, mobile, status, roles) VALUES (
viworks-postgres  | 	    'admin',
viworks-postgres  | 	    'admin@viworks.com',
viworks-postgres  | 	    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5u.Ge', -- admin123
viworks-postgres  | 	    '09123456789',
viworks-postgres  | 	    'active',
viworks-postgres  | 	    '["admin"]'
viworks-postgres  | 	);
viworks-postgres  | 2025-09-02 06:51:51.347 UTC [26] LOG:  checkpoint starting: time
viworks-postgres  | 2025-09-02 06:51:52.288 UTC [26] LOG:  checkpoint complete: wrote 12 buffers (0.1%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.907 s, sync=0.004 s, total=0.941 s; sync files=10, longest=0.002 s, average=0.001 s; distance=41 kB, estimate=41 kB

Redis logs:
viworks-redis  | 1:C 02 Sep 2025 06:46:51.018 # WARNING Memory overcommit must be enabled! Without it, a background save or replication may fail under low memory condition. Being disabled, it can also cause failures without low memory condition, see https://github.com/jemalloc/jemalloc/issues/1328. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
viworks-redis  | 1:C 02 Sep 2025 06:46:51.018 * oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
viworks-redis  | 1:C 02 Sep 2025 06:46:51.018 * Redis version=7.4.5, bits=64, commit=00000000, modified=0, pid=1, just started
viworks-redis  | 1:C 02 Sep 2025 06:46:51.018 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
viworks-redis  | 1:M 02 Sep 2025 06:46:51.018 * monotonic clock: POSIX clock_gettime
viworks-redis  | 1:M 02 Sep 2025 06:46:51.019 * Running mode=standalone, port=6379.
viworks-redis  | 1:M 02 Sep 2025 06:46:51.020 * Server initialized
viworks-redis  | 1:M 02 Sep 2025 06:46:51.025 * Loading RDB produced by version 7.4.5
viworks-redis  | 1:M 02 Sep 2025 06:46:51.025 * RDB age 127 seconds
viworks-redis  | 1:M 02 Sep 2025 06:46:51.025 * RDB memory usage when created 0.93 Mb
viworks-redis  | 1:M 02 Sep 2025 06:46:51.025 * Done loading RDB, keys loaded: 0, keys expired: 0.
viworks-redis  | 1:M 02 Sep 2025 06:46:51.025 * DB loaded from disk: 0.005 seconds
viworks-redis  | 1:M 02 Sep 2025 06:46:51.025 * Ready to accept connections tcp
✅ Deployment completed successfully!
📅 Deployment completed at: Tue Sep  2 06:52:12 UTC 2025

🌐 Services are now running:
   Frontend: http://localhost:3000
   Backend:  http://localhost:8081
   Health:   http://localhost:8081/health
   WebSocket: ws://localhost:8081/ws

🔒 Security Status:
   ✅ Two-network security architecture active
   ✅ Public network: nginx only (ports 80/443)
   ✅ Internal network: all services isolated
   ✅ Containers running as non-*** users
   ✅ Network isolation implemented
   ✅ Health checks active
   ✅ Resource limits applied

📊 Container status:
NAME               IMAGE                         COMMAND                  SERVICE    CREATED         STATUS                          PORTS
viworks-agent      digitaloceandocker-agent      "/usr/local/bin/viwo…"   agent      5 minutes ago   Restarting (0) 35 seconds ago   
viworks-backend    digitaloceandocker-backend    "/usr/bin/dumb-init …"   backend    5 minutes ago   Up 5 minutes (healthy)          
viworks-frontend   digitaloceandocker-frontend   "dumb-init -- node s…"   frontend   5 minutes ago   Up 5 minutes (unhealthy)        
viworks-nginx      nginx:alpine                  "/docker-entrypoint.…"   nginx      5 minutes ago   Restarting (1) 20 seconds ago   
viworks-postgres   postgres:15-alpine            "docker-entrypoint.s…"   postgres   5 minutes ago   Up 5 minutes (healthy)          
viworks-redis      redis:7-alpine                "docker-entrypoint.s…"   redis      5 minutes ago   Up 5 minutes (healthy)          
viworks-website    digitaloceandocker-website    "docker-entrypoint.s…"   website    5 minutes ago   Up 5 minutes (unhealthy)        
2m 27s
Run echo "🔍 Verifying deployment..."
🔍 Verifying deployment...
Testing frontend...
