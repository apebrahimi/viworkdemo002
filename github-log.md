deploy
Started 26m 30s ago

1s
1s
1s
2s
0s
25m 24s
Run scp -i ~/.ssh/id_ed25519 deploy.sh ${DROPLET_USER}@${DROPLET_IP}:/tmp/
🚀 Starting ViWorks Automated Deployment...
📅 Deployment started at: Mon Sep  1 23:22:27 UTC 2025
🛑 Stopping all containers gracefully...
time="2025-09-01T23:22:27Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
🛑 Force stopping any running containers...
🧹 Removing containers with specific names...
🧹 Removing orphaned containers...
time="2025-09-01T23:22:27Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
🧹 Cleaning up Docker images...
Total reclaimed space: 0B
Deleted Images:
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
deleted: sha256:418dccb7d85a63a6aa574439840f7a6fa6fd2321b3e2394568a317735e867d35
Total reclaimed space: 359.3MB
🧹 Cleaning up unused networks...
Deleted Networks:
viworks-public
viworks-internal
🔍 Verifying no conflicting containers exist...
🧹 Cleaning up and resetting git repository...
From https://github.com/apebrahimi/viworkdemo002
   891a34f..bb89d79  main       -> origin/main
HEAD is now at bb89d79 Fix Dockerfile syntax error: add missing equals sign in --from flag
🌐 Setting up two-network security architecture...
5d7dce2c996d5759e9b050820e4a029e63e4a175589dac39f831b405c9f23b49
e38b544309a27d0f936400cf361566248ca033dbd912c07b5a0142f715e6e71e
🔨 Building and starting new containers with two-network security...
 postgres Pulling 
 redis Pulling 
 nginx Pulling 
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
 9824c27679d3 Pulling fs layer 
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
 9824c27679d3 Waiting 
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
 9824c27679d3 Pulling fs layer 
 6bc572a340ec Pulling fs layer 
 403e3f251637 Pulling fs layer 
 9adfbae99cb7 Pulling fs layer 
 7a8a46741e18 Pulling fs layer 
 c9ebe2ff2d2c Pulling fs layer 
 a992fbc61ecc Pulling fs layer 
 cb1ff4086f82 Pulling fs layer 
 9824c27679d3 Waiting 
 6bc572a340ec Waiting 
 403e3f251637 Waiting 
 9adfbae99cb7 Waiting 
 7a8a46741e18 Waiting 
 c9ebe2ff2d2c Waiting 
 a992fbc61ecc Waiting 
 cb1ff4086f82 Waiting 
 5e28347af205 Downloading [>                                                  ]  2.738kB/173.2kB
 5e28347af205 Verifying Checksum 
 5e28347af205 Download complete 
 4c55286bbede Downloading [==================================================>]     950B/950B
 4c55286bbede Verifying Checksum 
 4c55286bbede Download complete 
 0368fd46e3c6 Downloading [>                                                  ]  36.46kB/3.638MB
 0368fd46e3c6 Verifying Checksum 
 0368fd46e3c6 Download complete 
 0368fd46e3c6 Extracting [>                                                  ]  65.54kB/3.638MB
 0368fd46e3c6 Extracting [==========================>                        ]  1.901MB/3.638MB
 0368fd46e3c6 Extracting [==================================================>]  3.638MB/3.638MB
 0368fd46e3c6 Pull complete 
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Pull complete 
 5e28347af205 Extracting [=========>                                         ]  32.77kB/173.2kB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 311eca34042e Downloading [>                                                  ]  10.95kB/1.003MB
 311eca34042e Downloading [==================================================>]  1.003MB/1.003MB
 311eca34042e Verifying Checksum 
 311eca34042e Download complete 
 e6fe6f07e192 Downloading [>                                                  ]  127.9kB/12.41MB
 5e28347af205 Pull complete 
 311eca34042e Extracting [=>                                                 ]  32.77kB/1.003MB
 a2cadbfeca72 Downloading [==================================================>]      99B/99B
 a2cadbfeca72 Verifying Checksum 
 a2cadbfeca72 Download complete 
 e6fe6f07e192 Downloading [========================>                          ]  6.009MB/12.41MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 311eca34042e Pull complete 
 e6fe6f07e192 Verifying Checksum 
 e6fe6f07e192 Download complete 
 e6fe6f07e192 Extracting [>                                                  ]  131.1kB/12.41MB
 e6fe6f07e192 Extracting [=============>                                     ]  3.277MB/12.41MB
 e6fe6f07e192 Extracting [======================>                            ]  5.636MB/12.41MB
 e6fe6f07e192 Extracting [=======================================>           ]  9.699MB/12.41MB
 a976ed7e7808 Downloading [==================================================>]     574B/574B
 a976ed7e7808 Verifying Checksum 
 a976ed7e7808 Download complete 
 e6fe6f07e192 Extracting [==================================================>]  12.41MB/12.41MB
 e6fe6f07e192 Pull complete 
 9824c27679d3 Downloading [>                                                  ]  38.24kB/3.8MB
 9824c27679d3 Downloading [>                                                  ]  38.24kB/3.8MB
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 9824c27679d3 Downloading [==================================================>]    3.8MB/3.8MB
 9824c27679d3 Verifying Checksum 
 9824c27679d3 Download complete 
 9824c27679d3 Downloading [==================================================>]    3.8MB/3.8MB
 9824c27679d3 Verifying Checksum 
 9824c27679d3 Download complete 
 4f4fb700ef54 Downloading [==================================================>]      32B/32B
 9824c27679d3 Extracting [>                                                  ]  65.54kB/3.8MB
 9824c27679d3 Extracting [>                                                  ]  65.54kB/3.8MB
 4f4fb700ef54 Download complete 
 a2cadbfeca72 Pull complete 
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Pull complete 
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 a976ed7e7808 Pull complete 
 9824c27679d3 Extracting [==================>                                ]  1.376MB/3.8MB
 9824c27679d3 Extracting [==================>                                ]  1.376MB/3.8MB
 redis Pulled 
 9824c27679d3 Extracting [==================================================>]    3.8MB/3.8MB
 9824c27679d3 Extracting [==================================================>]    3.8MB/3.8MB
 9824c27679d3 Extracting [==================================================>]    3.8MB/3.8MB
 9824c27679d3 Extracting [==================================================>]    3.8MB/3.8MB
 9824c27679d3 Pull complete 
 9824c27679d3 Pull complete 
 61a7421693bd Downloading [==================================================>]     969B/969B
 61a7421693bd Download complete 
 61a7421693bd Extracting [==================================================>]     969B/969B
 61a7421693bd Extracting [==================================================>]     969B/969B
 61a7421693bd Pull complete 
 51a939567803 Downloading [>                                                  ]     12kB/1.116MB
 51a939567803 Verifying Checksum 
 51a939567803 Download complete 
 51a939567803 Extracting [=>                                                 ]  32.77kB/1.116MB
 a612d38c9b48 Downloading [==================================================>]     175B/175B
 a612d38c9b48 Verifying Checksum 
 a612d38c9b48 Download complete 
 51a939567803 Extracting [==================================================>]  1.116MB/1.116MB
 51a939567803 Pull complete 
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 a612d38c9b48 Pull complete 
 901a9540064a Downloading [==================================================>]     116B/116B
 901a9540064a Verifying Checksum 
 901a9540064a Download complete 
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Pull complete 
 0f940631c13f Downloading [=======>                                           ]  1.369kB/9.448kB
 0f940631c13f Downloading [==================================================>]  9.448kB/9.448kB
 0f940631c13f Verifying Checksum 
 0f940631c13f Download complete 
 6c13c55b4b82 Downloading [>                                                  ]  536.6kB/103.9MB
 6c13c55b4b82 Downloading [==>                                                ]  4.293MB/103.9MB
 a15854d6fd91 Downloading [==================================================>]     129B/129B
 a15854d6fd91 Verifying Checksum 
 a15854d6fd91 Download complete 
 6c13c55b4b82 Downloading [======>                                            ]  12.84MB/103.9MB
 6c13c55b4b82 Downloading [==========>                                        ]  21.89MB/103.9MB
 685be96195b7 Downloading [==================================================>]     171B/171B
 685be96195b7 Verifying Checksum 
 685be96195b7 Download complete 
 6c13c55b4b82 Downloading [===============>                                   ]  32.58MB/103.9MB
 6c13c55b4b82 Downloading [===================>                               ]  40.04MB/103.9MB
 ce414b3fa674 Downloading [===========>                                       ]  1.369kB/5.927kB
 ce414b3fa674 Downloading [==================================================>]  5.927kB/5.927kB
 ce414b3fa674 Verifying Checksum 
 ce414b3fa674 Download complete 
 6c13c55b4b82 Downloading [=======================>                           ]  49.16MB/103.9MB
 6c13c55b4b82 Downloading [============================>                      ]  58.25MB/103.9MB
 6afcd9ec0fd9 Downloading [==================================================>]     185B/185B
 6afcd9ec0fd9 Verifying Checksum 
 6afcd9ec0fd9 Download complete 
 6c13c55b4b82 Downloading [===============================>                   ]  65.72MB/103.9MB
 6c13c55b4b82 Downloading [===================================>               ]  73.19MB/103.9MB
 6bc572a340ec Downloading [>                                                  ]  18.84kB/1.806MB
 6c13c55b4b82 Downloading [=======================================>           ]  81.15MB/103.9MB
 6bc572a340ec Verifying Checksum 
 6bc572a340ec Download complete 
 6bc572a340ec Extracting [>                                                  ]  32.77kB/1.806MB
 6c13c55b4b82 Downloading [==========================================>        ]  89.13MB/103.9MB
 6bc572a340ec Extracting [==================================================>]  1.806MB/1.806MB
 6c13c55b4b82 Downloading [==============================================>    ]  97.12MB/103.9MB
 6bc572a340ec Pull complete 
 403e3f251637 Downloading [==================================================>]     628B/628B
 403e3f251637 Verifying Checksum 
 403e3f251637 Download complete 
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Pull complete 
 6c13c55b4b82 Verifying Checksum 
 6c13c55b4b82 Download complete 
 6c13c55b4b82 Extracting [>                                                  ]  557.1kB/103.9MB
 6c13c55b4b82 Extracting [=>                                                 ]  2.228MB/103.9MB
 9adfbae99cb7 Downloading [==================================================>]     955B/955B
 9adfbae99cb7 Verifying Checksum 
 9adfbae99cb7 Download complete 
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Pull complete 
 6c13c55b4b82 Extracting [==>                                                ]  5.014MB/103.9MB
 6c13c55b4b82 Extracting [====>                                              ]   9.47MB/103.9MB
 7a8a46741e18 Downloading [==================================================>]     405B/405B
 7a8a46741e18 Verifying Checksum 
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
 6c13c55b4b82 Extracting [======>                                            ]  12.81MB/103.9MB
 c9ebe2ff2d2c Pull complete 
 a992fbc61ecc Downloading [=====================================>             ]  1.049kB/1.398kB
 a992fbc61ecc Downloading [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Verifying Checksum 
 a992fbc61ecc Download complete 
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 6c13c55b4b82 Extracting [=======>                                           ]  16.15MB/103.9MB
 a992fbc61ecc Pull complete 
 6c13c55b4b82 Extracting [=========>                                         ]   19.5MB/103.9MB
 6c13c55b4b82 Extracting [==========>                                        ]  22.84MB/103.9MB
 cb1ff4086f82 Downloading [>                                                  ]  168.5kB/16.84MB
 6c13c55b4b82 Extracting [============>                                      ]  25.62MB/103.9MB
 cb1ff4086f82 Downloading [=======================>                           ]  7.922MB/16.84MB
 6c13c55b4b82 Extracting [=============>                                     ]  27.85MB/103.9MB
 cb1ff4086f82 Downloading [===============================================>   ]  16.04MB/16.84MB
 cb1ff4086f82 Verifying Checksum 
 cb1ff4086f82 Download complete 
 cb1ff4086f82 Extracting [>                                                  ]  196.6kB/16.84MB
 6c13c55b4b82 Extracting [==============>                                    ]  30.64MB/103.9MB
 cb1ff4086f82 Extracting [=>                                                 ]  589.8kB/16.84MB
 cb1ff4086f82 Extracting [======>                                            ]  2.163MB/16.84MB
 6c13c55b4b82 Extracting [===============>                                   ]  32.87MB/103.9MB
 cb1ff4086f82 Extracting [==============>                                    ]  4.719MB/16.84MB
 6c13c55b4b82 Extracting [================>                                  ]  35.09MB/103.9MB
 cb1ff4086f82 Extracting [=======================>                           ]  7.864MB/16.84MB
 6c13c55b4b82 Extracting [=================>                                 ]  36.77MB/103.9MB
 cb1ff4086f82 Extracting [=============================>                     ]   9.83MB/16.84MB
 6c13c55b4b82 Extracting [==================>                                ]  38.99MB/103.9MB
 cb1ff4086f82 Extracting [===================================>               ]  11.99MB/16.84MB
 6c13c55b4b82 Extracting [===================>                               ]  41.22MB/103.9MB
 cb1ff4086f82 Extracting [===========================================>       ]  14.55MB/16.84MB
 6c13c55b4b82 Extracting [====================>                              ]  43.45MB/103.9MB
 cb1ff4086f82 Extracting [=================================================> ]  16.52MB/16.84MB
 6c13c55b4b82 Extracting [=====================>                             ]  45.68MB/103.9MB
 cb1ff4086f82 Extracting [==================================================>]  16.84MB/16.84MB
 6c13c55b4b82 Extracting [=======================>                           ]  48.46MB/103.9MB
 cb1ff4086f82 Pull complete 
 nginx Pulled 
 6c13c55b4b82 Extracting [========================>                          ]  50.69MB/103.9MB
 6c13c55b4b82 Extracting [=========================>                         ]  52.92MB/103.9MB
 6c13c55b4b82 Extracting [==========================>                        ]  55.15MB/103.9MB
 6c13c55b4b82 Extracting [===========================>                       ]  57.38MB/103.9MB
 6c13c55b4b82 Extracting [=============================>                     ]  60.72MB/103.9MB
 6c13c55b4b82 Extracting [==============================>                    ]  62.95MB/103.9MB
 6c13c55b4b82 Extracting [===============================>                   ]  66.29MB/103.9MB
 6c13c55b4b82 Extracting [=================================>                 ]  69.63MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  72.97MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.65MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]  75.76MB/103.9MB
 6c13c55b4b82 Extracting [=====================================>             ]  77.99MB/103.9MB
 6c13c55b4b82 Extracting [======================================>            ]  80.22MB/103.9MB
 6c13c55b4b82 Extracting [=======================================>           ]  82.44MB/103.9MB
 6c13c55b4b82 Extracting [========================================>          ]  84.67MB/103.9MB
 6c13c55b4b82 Extracting [==========================================>        ]  87.46MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]  89.69MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]  91.36MB/103.9MB
 6c13c55b4b82 Extracting [==============================================>    ]  95.81MB/103.9MB
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
#1 reading from stdin 1.93kB done
#1 DONE 0.0s
#2 [website internal] load build definition from Dockerfile
#2 transferring dockerfile: 2.04kB done
#2 DONE 0.0s
#3 [agent internal] load build definition from Dockerfile.alpine-production
#3 transferring dockerfile: 1.79kB done
#3 WARN: FromAsCasing: 'as' and 'FROM' keywords' casing do not match (line 2)
#3 DONE 0.0s
#4 [frontend internal] load build definition from Dockerfile
#4 transferring dockerfile: 1.25kB 0.0s done
#4 DONE 0.1s
#5 [backend internal] load build definition from Dockerfile.fixed
#5 transferring dockerfile: 1.87kB 0.0s done
#5 WARN: FromAsCasing: 'as' and 'FROM' keywords' casing do not match (line 2)
#5 DONE 0.1s
#6 [agent internal] load metadata for docker.io/library/rust:1.89.0-alpine
#6 ...
#7 [agent internal] load metadata for docker.io/library/alpine:latest
#7 DONE 1.2s
#6 [agent internal] load metadata for docker.io/library/rust:1.89.0-alpine
#6 DONE 1.3s
#8 [agent internal] load .dockerignore
#8 transferring context: 2B done
#8 DONE 0.0s
#9 [website internal] load metadata for docker.io/library/node:18-alpine
#9 DONE 1.4s
#10 [frontend internal] load metadata for docker.io/library/node:22-alpine
#10 DONE 1.4s
#11 [website internal] load .dockerignore
#11 transferring context: 2B 0.0s done
#11 DONE 0.0s
#12 [agent builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 resolve docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46 0.0s done
#12 DONE 0.0s
#13 [agent stage-1 1/9] FROM docker.io/library/alpine:latest@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#13 resolve docker.io/library/alpine:latest@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1 0.0s done
#13 sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1 9.22kB / 9.22kB done
#13 sha256:eafc1edb577d2e9b458664a15f23ea1c370214193226069eb22921169fc7e43f 1.02kB / 1.02kB done
#13 sha256:9234e8fb04c47cfe0f49931e4ac7eb76fa904e33b7f8576aec0501c085f02516 581B / 581B done
#13 DONE 0.1s
#14 [backend internal] load metadata for docker.io/library/alpine:3.22
#14 DONE 1.5s
#15 [agent internal] load build context
#15 transferring context: 156.22kB 0.0s done
#15 DONE 0.1s
#16 [backend internal] load .dockerignore
#16 transferring context: 2B done
#16 DONE 0.1s
#17 [frontend internal] load .dockerignore
#17 transferring context: 2B done
#17 DONE 0.1s
#12 [agent builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 sha256:8f7660a6bab9aa847e6a2af94673d75f67d2d9a7148d3f3142d7e23034688c65 0B / 61.61MB 0.1s
#12 sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 0B / 261.27MB 0.1s
#12 sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46 3.90kB / 3.90kB done
#12 sha256:f9617326395be71547efa3c8b8d58b89ff958afc594596713bceb585aabc067e 1.54kB / 1.54kB done
#12 sha256:c7db8072fa10b38ffff96132697449d8aece6dfc91f8a689491279bc56970d39 2.67kB / 2.67kB done
#12 ...
#13 [backend stage-1 1/9] FROM docker.io/library/alpine:latest@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#13 resolve docker.io/library/alpine:latest@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1 0.0s done
#13 sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1 9.22kB / 9.22kB done
#13 sha256:eafc1edb577d2e9b458664a15f23ea1c370214193226069eb22921169fc7e43f 1.02kB / 1.02kB done
#13 sha256:9234e8fb04c47cfe0f49931e4ac7eb76fa904e33b7f8576aec0501c085f02516 581B / 581B done
#13 DONE 0.1s
#18 [frontend internal] load build context
#18 DONE 0.0s
#19 [backend stage-1 1/7] FROM docker.io/library/alpine:3.22@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#19 DONE 0.0s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 resolve docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46 0.0s done
#12 sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46 3.90kB / 3.90kB done
#12 sha256:f9617326395be71547efa3c8b8d58b89ff958afc594596713bceb585aabc067e 1.54kB / 1.54kB done
#12 sha256:c7db8072fa10b38ffff96132697449d8aece6dfc91f8a689491279bc56970d39 2.67kB / 2.67kB done
#12 ...
#20 [website internal] load build context
#20 transferring context: 1.38MB 0.2s done
#20 DONE 0.2s
#21 [backend internal] load build context
#21 transferring context: 382.64kB 0.1s done
#21 DONE 0.1s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 sha256:8f7660a6bab9aa847e6a2af94673d75f67d2d9a7148d3f3142d7e23034688c65 5.24MB / 61.61MB 0.4s
#12 ...
#18 [frontend internal] load build context
#18 transferring context: 1.31MB 0.1s done
#18 DONE 0.3s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 sha256:8f7660a6bab9aa847e6a2af94673d75f67d2d9a7148d3f3142d7e23034688c65 11.53MB / 61.61MB 0.5s
#12 sha256:8f7660a6bab9aa847e6a2af94673d75f67d2d9a7148d3f3142d7e23034688c65 14.68MB / 61.61MB 0.6s
#12 sha256:8f7660a6bab9aa847e6a2af94673d75f67d2d9a7148d3f3142d7e23034688c65 23.07MB / 61.61MB 0.8s
#12 sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 13.63MB / 261.27MB 0.8s
#12 sha256:8f7660a6bab9aa847e6a2af94673d75f67d2d9a7148d3f3142d7e23034688c65 28.31MB / 61.61MB 0.9s
#12 sha256:8f7660a6bab9aa847e6a2af94673d75f67d2d9a7148d3f3142d7e23034688c65 34.60MB / 61.61MB 1.2s
#12 sha256:8f7660a6bab9aa847e6a2af94673d75f67d2d9a7148d3f3142d7e23034688c65 40.89MB / 61.61MB 1.5s
#12 sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 28.95MB / 261.27MB 1.5s
#12 sha256:8f7660a6bab9aa847e6a2af94673d75f67d2d9a7148d3f3142d7e23034688c65 50.33MB / 61.61MB 1.8s
#12 sha256:8f7660a6bab9aa847e6a2af94673d75f67d2d9a7148d3f3142d7e23034688c65 53.48MB / 61.61MB 1.9s
#12 sha256:8f7660a6bab9aa847e6a2af94673d75f67d2d9a7148d3f3142d7e23034688c65 56.62MB / 61.61MB 2.0s
#12 sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 42.73MB / 261.27MB 2.0s
#12 sha256:8f7660a6bab9aa847e6a2af94673d75f67d2d9a7148d3f3142d7e23034688c65 61.61MB / 61.61MB 2.1s
#12 sha256:8f7660a6bab9aa847e6a2af94673d75f67d2d9a7148d3f3142d7e23034688c65 61.61MB / 61.61MB 2.2s done
#12 sha256:8f7660a6bab9aa847e6a2af94673d75f67d2d9a7148d3f3142d7e23034688c65 61.61MB / 61.61MB 2.2s done
#12 sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 56.77MB / 261.27MB 2.4s
#12 extracting sha256:8f7660a6bab9aa847e6a2af94673d75f67d2d9a7148d3f3142d7e23034688c65
#12 sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 74.45MB / 261.27MB 3.1s
#12 ...
#22 [agent stage-1 2/9] RUN apk update && apk add --no-cache     ca-certificates     libssl3     && rm -rf /var/cache/apk/*
#22 0.507 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/main/x86_64/APKINDEX.tar.gz
#22 0.714 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/community/x86_64/APKINDEX.tar.gz
#22 1.591 v3.22.1-326-ge10f1967b2c [https://dl-cdn.alpinelinux.org/alpine/v3.22/main]
#22 1.591 v3.22.1-336-gbc8bda71ff2 [https://dl-cdn.alpinelinux.org/alpine/v3.22/community]
#22 1.591 OK: 26322 distinct packages available
#22 1.770 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/main/x86_64/APKINDEX.tar.gz
#22 1.891 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/community/x86_64/APKINDEX.tar.gz
#22 2.526 (1/1) Installing ca-certificates (20250619-r0)
#22 2.568 Executing busybox-1.37.0-r18.trigger
#22 2.568 Executing ca-certificates-20250619-r0.trigger
#22 2.671 OK: 8 MiB in 17 packages
#22 DONE 3.5s
#23 [backend stage-1 2/7] RUN apk add --no-cache     ca-certificates     dumb-init     busybox-extras     netcat-openbsd     wget     curl     tzdata     bash     postgresql-client     redis
#23 0.548 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/main/x86_64/APKINDEX.tar.gz
#23 0.766 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/community/x86_64/APKINDEX.tar.gz
#23 1.819 (1/32) Upgrading busybox (1.37.0-r18 -> 1.37.0-r19)
#23 1.819 Executing busybox-1.37.0-r19.post-upgrade
#23 1.859 (2/32) Upgrading busybox-binsh (1.37.0-r18 -> 1.37.0-r19)
#23 1.859 (3/32) Upgrading ssl_client (1.37.0-r18 -> 1.37.0-r19)
#23 1.859 (4/32) Installing ncurses-terminfo-base (6.5_p20250503-r0)
#23 1.859 (5/32) Installing libncursesw (6.5_p20250503-r0)
#23 1.859 (6/32) Installing readline (8.2.13-r1)
#23 1.859 (7/32) Installing bash (5.2.37-r0)
#23 1.931 Executing bash-5.2.37-r0.post-install
#23 1.931 (8/32) Installing busybox-extras (1.37.0-r19)
#23 1.931 Executing busybox-extras-1.37.0-r19.post-install
#23 1.931 (9/32) Installing ca-certificates (20250619-r0)
#23 1.931 (10/32) Installing brotli-libs (1.1.0-r2)
#23 1.963 (11/32) Installing c-ares (1.34.5-r0)
#23 1.963 (12/32) Installing libunistring (1.3-r0)
#23 2.013 (13/32) Installing libidn2 (2.3.7-r0)
#23 2.013 (14/32) Installing nghttp2-libs (1.65.0-r0)
#23 2.013 (15/32) Installing libpsl (0.21.5-r3)
#23 2.021 (16/32) Installing zstd-libs (1.5.7-r0)
#23 2.082 (17/32) Installing libcurl (8.14.1-r1)
#23 2.082 (18/32) Installing curl (8.14.1-r1)
#23 2.082 (19/32) Installing dumb-init (1.2.5-r3)
#23 2.082 (20/32) Installing libmd (1.1.0-r0)
#23 2.082 (21/32) Installing libbsd (0.12.2-r0)
#23 2.082 (22/32) Installing netcat-openbsd (1.229.1-r0)
#23 2.082 (23/32) Installing postgresql-common (1.2-r1)
#23 2.096 Executing postgresql-common-1.2-r1.pre-install
#23 2.126 (24/32) Installing lz4-libs (1.10.0-r0)
#23 2.126 (25/32) Installing libpq (17.6-r0)
#23 2.126 (26/32) Installing postgresql17-client (17.6-r0)
#23 2.180 (27/32) Installing libgcc (14.2.0-r6)
#23 2.180 (28/32) Installing libstdc++ (14.2.0-r6)
#23 2.228 (29/32) Installing redis (8.0.3-r0)
#23 2.253 Executing redis-8.0.3-r0.pre-install
#23 2.356 Executing redis-8.0.3-r0.post-install
#23 2.365 (30/32) Installing tzdata (2025b-r0)
#23 2.500 (31/32) Installing pcre2 (10.43-r1)
#23 2.500 (32/32) Installing wget (1.25.0-r1)
#23 2.500 Executing busybox-1.37.0-r19.trigger
#23 2.524 Executing ca-certificates-20250619-r0.trigger
#23 2.673 Executing postgresql-common-1.2-r1.trigger
#23 2.678 * Setting postgresql17 as the default version
#23 2.853 WARNING: opening from cache https://dl-cdn.alpinelinux.org/alpine/v3.22/main: No such file or directory
#23 2.853 WARNING: opening from cache https://dl-cdn.alpinelinux.org/alpine/v3.22/community: No such file or directory
#23 2.901 OK: 26 MiB in 45 packages
#23 DONE 3.3s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 ...
#24 [backend stage-1 3/7] WORKDIR /app
#24 DONE 0.2s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 95.42MB / 261.27MB 3.7s
#12 sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 118.49MB / 261.27MB 4.1s
#12 ...
#25 [agent stage-1 3/9] RUN addgroup -g 1000 viworks &&     adduser -D -s /bin/bash -u 1000 -G viworks viworks
#25 DONE 0.7s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 131.63MB / 261.27MB 4.4s
#12 sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 147.85MB / 261.27MB 4.7s
#12 ...
#26 [agent stage-1 4/9] RUN mkdir -p /etc/viworks /var/log/viworks /usr/local/bin
#26 DONE 0.6s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 164.63MB / 261.27MB 5.0s
#12 sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 183.50MB / 261.27MB 5.4s
#12 sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 204.47MB / 261.27MB 5.7s
#12 sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 221.25MB / 261.27MB 6.0s
#12 sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 247.46MB / 261.27MB 6.4s
#12 sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 261.27MB / 261.27MB 6.6s
#12 sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 261.27MB / 261.27MB 6.7s done
#12 extracting sha256:8f7660a6bab9aa847e6a2af94673d75f67d2d9a7148d3f3142d7e23034688c65 5.0s
#12 ...
#27 [website base 1/1] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#27 resolve docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e 0.0s done
#27 sha256:929b04d7c782f04f615cf785488fed452b6569f87c73ff666ad553a7554f0006 1.72kB / 1.72kB done
#27 sha256:ee77c6cd7c1886ecc802ad6cedef3a8ec1ea27d1fb96162bf03dd3710839b8da 6.18kB / 6.18kB done
#27 sha256:f18232174bc91741fdf3da96d85011092101a032a93a388b79e99e69c2d5c870 3.64MB / 3.64MB 0.4s done
#27 sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e 7.67kB / 7.67kB done
#27 extracting sha256:f18232174bc91741fdf3da96d85011092101a032a93a388b79e99e69c2d5c870 0.9s done
#27 sha256:dd71dde834b5c203d162902e6b8994cb2309ae049a0eabc4efea161b2b5a3d0e 40.01MB / 40.01MB 1.9s done
#27 sha256:1e5a4c89cee5c0826c540ab06d4b6b491c96eda01837f430bd47f0d26702d6e3 1.26MB / 1.26MB 2.3s done
#27 extracting sha256:dd71dde834b5c203d162902e6b8994cb2309ae049a0eabc4efea161b2b5a3d0e 6.4s done
#27 sha256:25ff2da83641908f65c3a74d80409d6b1b62ccfaab220b9ea70b80df5a2e0549 446B / 446B 2.5s done
#27 extracting sha256:1e5a4c89cee5c0826c540ab06d4b6b491c96eda01837f430bd47f0d26702d6e3 0.1s done
#27 extracting sha256:25ff2da83641908f65c3a74d80409d6b1b62ccfaab220b9ea70b80df5a2e0549 done
#27 DONE 9.0s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 ...
#28 [website builder 1/5] WORKDIR /app
#28 DONE 0.4s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 ...
#29 [website runner 2/8] RUN addgroup --system --gid 1001 nodejs
#29 DONE 0.4s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 extracting sha256:8f7660a6bab9aa847e6a2af94673d75f67d2d9a7148d3f3142d7e23034688c65 7.6s done
#12 ...
#30 [frontend builder 1/6] FROM docker.io/library/node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9
#30 resolve docker.io/library/node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9 0.1s done
#30 sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9 6.41kB / 6.41kB done
#30 sha256:704b199e36b5c1bc505da773f742299dc1ee5a4c70b86d1eb406c334f63253c6 1.72kB / 1.72kB done
#30 sha256:70e3575514953b11adf257269030673dcb065f31ea11d9d86eb5c65b5a3c475f 6.42kB / 6.42kB done
#30 sha256:6a088b2daae062d11086b47ecffca042d75b83c6228cb05d89c60c854c3265cd 51.04MB / 51.04MB 4.3s done
#30 sha256:52719e552fdfa1fbd5bd1e6ab184f77b28ec2b59509c98da3ef00ccb84385a51 1.26MB / 1.26MB 3.0s done
#30 sha256:016c0e95211121b6a80955630caaca8899d6572d51c48561f95a9ad97788a63a 444B / 444B 3.5s done
#30 extracting sha256:6a088b2daae062d11086b47ecffca042d75b83c6228cb05d89c60c854c3265cd 5.0s
#30 ...
#31 [website runner 3/8] RUN adduser --system --uid 1001 nextjs
#31 DONE 0.6s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 extracting sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf
#12 ...
#32 [website deps 1/4] RUN apk add --no-cache libc6-compat
#32 0.792 fetch https://dl-cdn.alpinelinux.org/alpine/v3.21/main/x86_64/APKINDEX.tar.gz
#32 1.031 fetch https://dl-cdn.alpinelinux.org/alpine/v3.21/community/x86_64/APKINDEX.tar.gz
#32 1.798 (1/3) Installing musl-obstack (1.2.3-r2)
#32 1.803 (2/3) Installing libucontext (1.3.2-r0)
#32 1.807 (3/3) Installing gcompat (1.1.0-r4)
#32 1.816 OK: 10 MiB in 20 packages
#32 DONE 2.0s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 ...
#33 [website deps 2/4] WORKDIR /app
#33 DONE 0.1s
#34 [website deps 3/4] COPY package.json pnpm-lock.yaml* ./
#34 DONE 0.1s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 ...
#30 [frontend builder 1/6] FROM docker.io/library/node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9
#30 extracting sha256:6a088b2daae062d11086b47ecffca042d75b83c6228cb05d89c60c854c3265cd 7.0s done
#30 extracting sha256:52719e552fdfa1fbd5bd1e6ab184f77b28ec2b59509c98da3ef00ccb84385a51 0.2s done
#30 extracting sha256:016c0e95211121b6a80955630caaca8899d6572d51c48561f95a9ad97788a63a done
#30 DONE 12.1s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 ...
#35 [frontend builder 2/6] WORKDIR /app
#35 DONE 0.1s
#36 [frontend builder 3/6] COPY package*.json ./
#36 DONE 0.1s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 ...
#37 [frontend runner 2/7] RUN apk add --no-cache dumb-init
#37 0.566 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/main/x86_64/APKINDEX.tar.gz
#37 0.709 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/community/x86_64/APKINDEX.tar.gz
#37 1.601 (1/1) Installing dumb-init (1.2.5-r3)
#37 1.612 Executing busybox-1.37.0-r18.trigger
#37 1.622 OK: 10 MiB in 19 packages
#37 DONE 2.0s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 ...
#38 [frontend runner 3/7] RUN addgroup -g 1001 -S nodejs &&     adduser -u 1001 -S nextjs -G nodejs
#38 DONE 0.6s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 ...
#39 [frontend runner 4/7] WORKDIR /app
#39 DONE 0.1s
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 extracting sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 5.1s
#12 extracting sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 10.2s
#12 ...
#40 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#40 4.350 
#40 4.350 added 1 package in 4s
#40 4.351 
#40 4.351 1 package is looking for funding
#40 4.351   run `npm fund` for details
#40 4.355 npm notice
#40 4.355 npm notice New major version of npm available! 10.8.2 -> 11.5.2
#40 4.355 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.5.2
#40 4.355 npm notice To update run: npm install -g npm@11.5.2
#40 4.355 npm notice
#40 9.853 Lockfile is up to date, resolution step is skipped
#40 10.19 Progress: resolved 1, reused 0, downloaded 0, added 0
#40 ...
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 ...
#41 [frontend builder 4/6] RUN npm install
#41 ...
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 extracting sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 15.2s
#12 extracting sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 20.3s
#12 ...
#40 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#40 10.75 Packages: +507
#40 10.75 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
#40 11.21 Progress: resolved 507, reused 0, downloaded 0, added 0
#40 12.21 Progress: resolved 507, reused 0, downloaded 6, added 0
#40 13.20 Progress: resolved 507, reused 0, downloaded 45, added 12
#40 14.22 Progress: resolved 507, reused 0, downloaded 60, added 15
#40 16.90 Progress: resolved 507, reused 0, downloaded 61, added 15
#40 18.02 Progress: resolved 507, reused 0, downloaded 68, added 16
#40 19.03 Progress: resolved 507, reused 0, downloaded 74, added 19
#40 20.82 Progress: resolved 507, reused 0, downloaded 75, added 19
#40 ...
#12 [backend builder  1/10] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 extracting sha256:7dc1dd2a17b09b5edae96526662eca709441d2b0be4073a3d7d8423a37f3c9bf 22.1s done
#12 DONE 32.7s
#42 [backend builder  2/11] WORKDIR /app
#42 DONE 0.4s
#43 [agent builder  2/10] RUN apk update && apk add --no-cache     build-base     pkgconfig     openssl-dev     musl-dev     ca-certificates     && rm -rf /var/cache/apk/*
#43 0.666 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/main/x86_64/APKINDEX.tar.gz
#43 0.933 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/community/x86_64/APKINDEX.tar.gz
#43 2.482 v3.22.1-326-ge10f1967b2c [https://dl-cdn.alpinelinux.org/alpine/v3.22/main]
#43 2.482 v3.22.1-336-gbc8bda71ff2 [https://dl-cdn.alpinelinux.org/alpine/v3.22/community]
#43 2.482 OK: 26323 distinct packages available
#43 2.787 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/main/x86_64/APKINDEX.tar.gz
#43 3.014 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/community/x86_64/APKINDEX.tar.gz
#43 4.357 (1/13) Upgrading libcrypto3 (3.5.1-r0 -> 3.5.2-r0)
#43 4.457 (2/13) Upgrading libssl3 (3.5.1-r0 -> 3.5.2-r0)
#43 4.486 (3/13) Installing libmagic (5.46-r2)
#43 4.560 (4/13) Installing file (5.46-r2)
#43 4.564 (5/13) Installing libstdc++-dev (14.2.0-r6)
#43 4.960 (6/13) Installing musl-dev (1.2.5-r10)
#43 5.166 (7/13) Installing g++ (14.2.0-r6)
#43 6.185 (8/13) Installing make (4.4.1-r3)
#43 6.203 (9/13) Installing fortify-headers (1.1-r5)
#43 6.207 (10/13) Installing patch (2.8-r0)
#43 6.212 (11/13) Installing build-base (0.5-r3)
#43 6.212 (12/13) Installing pkgconf (2.4.3-r0)
#43 6.218 (13/13) Installing openssl-dev (3.5.2-r0)
#43 6.268 Executing busybox-1.37.0-r18.trigger
#43 6.285 Executing ca-certificates-20250619-r0.trigger
#43 6.471 OK: 247 MiB in 40 packages
#43 DONE 7.3s
#44 [agent builder  3/10] WORKDIR /app
#44 DONE 0.1s
#45 [backend builder  3/11] RUN apk add --no-cache     pkgconfig     openssl-dev     postgresql-dev     musl-dev     gcc     curl
#45 0.686 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/main/x86_64/APKINDEX.tar.gz
#45 0.969 fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/community/x86_64/APKINDEX.tar.gz
#45 2.518 (1/37) Upgrading libcrypto3 (3.5.1-r0 -> 3.5.2-r0)
#45 2.641 (2/37) Upgrading libssl3 (3.5.1-r0 -> 3.5.2-r0)
#45 2.658 (3/37) Installing brotli-libs (1.1.0-r2)
#45 2.683 (4/37) Installing c-ares (1.34.5-r0)
#45 2.692 (5/37) Installing libunistring (1.3-r0)
#45 2.739 (6/37) Installing libidn2 (2.3.7-r0)
#45 2.746 (7/37) Installing nghttp2-libs (1.65.0-r0)
#45 2.759 (8/37) Installing libpsl (0.21.5-r3)
#45 2.764 (9/37) Installing libcurl (8.14.1-r1)
#45 2.786 (10/37) Installing curl (8.14.1-r1)
#45 2.795 (11/37) Installing musl-dev (1.2.5-r10)
#45 3.037 (12/37) Installing pkgconf (2.4.3-r0)
#45 3.051 (13/37) Installing openssl-dev (3.5.2-r0)
#45 3.120 (14/37) Installing libpq (17.6-r0)
#45 3.132 (15/37) Installing libpq-dev (17.6-r0)
#45 3.185 (16/37) Installing libecpg (17.6-r0)
#45 3.194 (17/37) Installing libecpg-dev (17.6-r0)
#45 3.231 (18/37) Installing clang18-headers (18.1.8-r5)
#45 3.429 (19/37) Installing libffi (3.4.8-r0)
#45 3.436 (20/37) Installing xz-libs (5.8.1-r0)
#45 3.441 (21/37) Installing libxml2 (2.13.8-r0)
#45 3.466 (22/37) Installing llvm18-libs (18.1.8-r5)
#45 6.817 (23/37) Installing clang18-libs (18.1.8-r5)
#45 ...
#46 [agent builder  4/10] COPY Cargo.toml Cargo.lock ./
#46 DONE 0.1s
#47 [agent builder  5/10] RUN mkdir src && echo "fn main() {}" > src/main.rs
#47 DONE 0.4s
#40 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#40 23.45 Progress: resolved 507, reused 0, downloaded 76, added 19
#40 24.46 Progress: resolved 507, reused 0, downloaded 85, added 22
#40 25.46 Progress: resolved 507, reused 0, downloaded 151, added 41
#40 26.48 Progress: resolved 507, reused 0, downloaded 199, added 55
#40 27.48 Progress: resolved 507, reused 0, downloaded 220, added 60
#40 28.50 Progress: resolved 507, reused 0, downloaded 234, added 64
#40 29.50 Progress: resolved 507, reused 0, downloaded 243, added 67
#40 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 1.105     Updating crates.io index
#48 4.768  Downloading crates ...
#48 4.906   Downloaded actix-utils v3.0.1
#48 4.943   Downloaded alloc-stdlib v0.2.2
#48 4.976   Downloaded tower-service v0.3.3
#48 4.990   Downloaded toml_write v0.1.2
#48 5.011   Downloaded option-ext v0.2.0
#48 5.025   Downloaded ref-cast-impl v1.0.24
#48 5.033   Downloaded ryu v1.0.20
#48 5.054   Downloaded tiny-keccak v2.0.2
#48 5.067   Downloaded tinystr v0.8.1
#48 5.079   Downloaded miniz_oxide v0.8.9
#48 5.092   Downloaded rand v0.9.2
#48 5.107   Downloaded regex-syntax v0.8.6
#48 5.147   Downloaded regex-lite v0.1.7
#48 5.163   Downloaded rustls-webpki v0.101.7
#48 5.218   Downloaded regex v1.11.2
#48 5.238   Downloaded rustls v0.21.12
#48 5.296   Downloaded tracing-subscriber v0.3.20
#48 5.338   Downloaded schemars v0.9.0
#48 5.379   Downloaded regex-automata v0.4.10
#48 5.486   Downloaded serde v1.0.219
#48 5.506   Downloaded schemars v1.0.4
#48 5.594   Downloaded nix v0.27.1
#48 5.678   Downloaded openssl v0.10.73
#48 5.743   Downloaded webpki-***s v0.25.4
#48 5.799   Downloaded zerocopy v0.8.26
#48 5.903   Downloaded#48 ...
#45 [backend builder  3/11] RUN apk add --no-cache     pkgconfig     openssl-dev     postgresql-dev     musl-dev     gcc     curl
#45 8.785 (24/37) Installing fortify-headers (1.1-r5)
#45 8.794 (25/37) Installing libstdc++-dev (14.2.0-r6)
#45 9.174 (26/37) Installing llvm18-linker-tools (18.1.8-r5)
#45 9.183 (27/37) Installing clang18 (18.1.8-r5)
#45 9.216 (28/37) Installing icu-data-en (76.1-r1)
#45 9.262 Executing icu-data-en-76.1-r1.post-install
#45 9.273 *
#45 9.273 * If you need ICU with non-English locales and legacy charset support, install
#45 9.273 * package icu-data-full.
#45 9.273 *
#45 9.275 (29/37) Installing icu-libs (76.1-r1)
#45 9.398 (30/37) Installing icu (76.1-r1)
#45 9.426 (31/37) Installing icu-dev (76.1-r1)
#45 9.531 (32/37) Installing llvm18 (18.1.8-r5)
#45 11.98 (33/37) Installing lz4-libs (1.10.0-r0)
#45 11.98 (34/37) Installing lz4-dev (1.10.0-r0)
#45 11.99 (35/37) Installing zstd (1.5.7-r0)
#45 12.00 (36/37) Installing zstd-dev (1.5.7-r0)
#45 12.01 (37/37) Installing postgresql17-dev (17.6-r0)
#45 12.29 Executing busybox-1.37.0-r18.trigger
#45 12.30 Executing ca-certificates-20250619-r0.trigger
#45 12.39 OK: 611 MiB in 64 packages
#45 DONE 13.5s
#48 [agent builder  6/10] RUN cargo build --release
#48 5.903   Downloaded vcpkg v0.2.15
#48 ...
#40 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#40 30.50 Progress: resolved 507, reused 0, downloaded 264, added 72
#40 31.52 Progress: resolved 507, reused 0, downloaded 319, added 90
#40 32.52 Progress: resolved 507, reused 0, downloaded 333, added 93
#40 33.52 Progress: resolved 507, reused 0, downloaded 374, added 105
#40 34.52 Progress: resolved 507, reused 0, downloaded 440, added 125
#40 35.55 Progress: resolved 507, reused 0, downloaded 460, added 129
#40 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 6.142   Downloaded ring v0.17.14
#48 6.417   Downloaded reqwest v0.11.27
#48 6.446   Downloaded winnow v0.7.13
#48 6.481   Downloaded time v0.3.42
#48 6.510   Downloaded serde_with v3.14.0
#48 6.546   Downloaded serde_json v1.0.143
#48 6.578   Downloaded sysinfo v0.37.0
#48 6.613   Downloaded pest v2.8.1
#48 6.629   Downloaded syn v2.0.106
#48 6.670   Downloaded nom v7.1.3
#48 6.684   Downloaded idna v1.1.0
#48 6.695   Downloaded yaml-rust2 v0.8.1
#48 6.799   Downloaded tokio-util v0.7.16
#48 6.818   Downloaded mio v1.0.4
#48 6.849   Downloaded indexmap v2.11.0
#48 6.869   Downloaded zerovec v0.11.4
#48 6.893   Downloaded icu_properties_data v2.0.1
#48 6.919   Downloaded encoding_rs v0.8.35
#48 7.023   Downloaded openssl-sys v0.9.109
#48 7.060   Downloaded minimal-lexical v0.2.1
#48 7.085   Downloaded memchr v2.7.5
#48 7.102   Downloaded libc v0.2.175
#48 7.185   Downloaded zstd-sys v2.0.15+zstd.1.5.7
#48 7.357   Downloaded
#48 ...
#49 [backend builder  4/11] RUN rustup target add x86_64-unknown-linux-musl
#49 1.156 info: component 'rust-std' for target 'x86_64-unknown-linux-musl' is up to date
#49 DONE 1.4s
#48 [agent builder  6/10] RUN cargo build --release
#48 7.357   Downloaded unicode-segmentation v1.12.0
#48 7.375   Downloaded zerotrie v0.2.2
#48 7.400   Downloaded uuid v1.18.0
#48 7.417   Downloaded url v2.5.7
#48 7.429   Downloaded typenum v1.18.0
#48 7.441   Downloaded time-macros v0.2.23
#48 7.465   Downloaded#48 ...
#50 [backend builder  5/11] COPY Cargo.toml Cargo.lock* ./
#50 DONE 0.1s
#48 [agent builder  6/10] RUN cargo build --release
#48 7.465   Downloaded thiserror v2.0.16
#48 7.512   Downloaded socket2 v0.6.0
#48 7.512   Downloaded socket2 v0.5.10
#48 7.535   Downloaded sharded-slab v0.1.7
#48 7.535   Downloaded pest_meta v2.8.1
#48 7.558   Downloaded log v0.4.27
#48 7.573   Downloaded indexmap v1.9.3
#48 7.585   Downloaded tracing v0.1.41
#48 7.624   Downloaded toml_edit v0.22.27
#48 7.659   Downloaded time-core v0.1.5
#48 7.683   Downloaded thiserror v1.0.69
#48 7.695   Downloaded synstructure v0.13.2
#48 7.703   Downloaded sync_wrapper v0.1.2
#48 7.705   Downloaded strsim v0.11.1
#48 7.710   Downloaded stable_deref_trait v1.2.0
#48 7.719   Downloaded smallvec v1.15.1
#48 7.727   Downloaded slab v0.4.11
#48 7.739   Downloaded signal-hook-registry v1.4.6
#48 7.748   Downloaded shlex v1.3.0
#48 7.751   Downloaded sha2 v0.10.9
#48 7.775   Downloaded sha1 v0.10.6
#48 7.775   Downloaded serde_urlencoded v0.7.1
#48 7.782   Downloaded serde_spanned v0.6.9
#48 7.790   Downloaded tokio v1.47.1
#48 7.958   Downloaded serde_repr v0.1.20
#48 ...
#51 [backend builder  6/11] RUN mkdir src && echo "fn main() {}" > src/main.rs
#51 DONE 0.4s
#48 [agent builder  6/10] RUN cargo build --release
#48 7.967   Downloaded serde_derive v1.0.219
#48 7.981   Downloaded sct v0.7.1
#48 7.987   Downloaded scopeguard v1.2.0
#48 8.015   Downloaded ron v0.8.1
#48 8.055   Downloaded proc-macro2 v1.0.101
#48 8.074   Downloaded pin-project-internal v1.1.10
#48 8.082   Downloaded pin-project v1.1.10
#48 8.140   Downloaded pest_derive v2.8.1
#48 8.148   Downloaded parking_lot v0.12.4
#48 8.162   Downloaded num-traits v0.2.19
#48 8.170   Downloaded language-tags v0.3.2
#48 8.173   Downloaded icu_provider v2.0.0
#48 8.186   Downloaded tracing-core v0.1.34
#48 8.192   Downloaded rustls-pemfile v1.0.4
#48 8.202   Downloaded rust-ini v0.20.0
#48 8.217   Downloaded rand_chacha v0.9.0
#48 8.217   Downloaded quote v1.0.40
#48 8.217   Downloaded pin-utils v0.1.0
#48 8.217   Downloaded pin-project-lite v0.2.16
#48 8.230   Downloaded parking_lot_core v0.9.11
#48 8.235   Downloaded ordered-multimap v0.7.3
#48 8.247   Downloaded once_cell v1.21.3
#48 8.265   Downloaded nu-ansi-term v0.50.1
#48 8.276   Downloaded native-tls v0.2.14
#48 8.279   Downloaded mime v0.3.17
#48 8.290   Downloaded lock_api v0.4.13
#48 8.293   Downloaded litemap v0.8.0
#48 8.302   Downloaded jobserver v0.1.34
#48 8.306   Downloaded itoa v1.0.15
#48 8.318   Downloaded is_terminal_polyfill v1.70.1
#48 8.326   Downloaded ipnet v2.11.0
#48 8.335   Downloaded impl-more v0.1.9
#48 8.339   Downloaded zstd-safe v7.2.4
#48 8.343   Downloaded zstd v0.13.3
#48 8.358   Downloaded zerofrom-derive v0.1.6
#48 8.361   Downloaded yoke v0.8.0
#48 8.368   Downloaded writeable v0.6.1
#48 8.375   Downloaded unicode-ident v1.0.18
#48 8.381   Downloaded ucd-trie v0.1.7
#48 8.391   Downloaded brotli v8.0.2
#48 8.458   Downloaded ref-cast v1.0.24
#48 8.462   Downloaded rand_core v0.9.3
#48 8.468   Downloaded ppv-lite86 v0.2.21
#48 8.475   Downloaded powerfmt v0.2.0
#48 8.490   Downloaded potential_utf v0.1.3
#48 8.495   Downloaded pkg-config v0.3.32
#48 8.498   Downloaded pest_generator v2.8.1
#48 8.500   Downloaded percent-encoding v2.3.2
#48 8.504   Downloaded pathdiff v0.2.3
#48 8.508   Downloaded openssl-probe v0.1.6
#48 8.512   Downloaded openssl-macros v0.1.1
#48 8.518   Downloaded lazy_static v1.5.0
#48 8.522   Downloaded json5 v0.4.1
#48 8.535   Downloaded idna_adapter v1.2.1
#48 8.538   Downloaded zerovec-derive v0.11.1
#48 8.549   Downloaded version_check v0.9.5
#48 8.556   Downloaded utf8parse v0.2.2
#48 8.560   Downloaded utf8_iter v1.0.4
#48 8.566   Downloaded untrusted v0.9.0
#48 8.580   Downloaded unicode-xid v0.2.6
#48 8.583   Downloaded tracing-log v0.2.0
#48 8.586   Downloaded tracing-attributes v0.1.30
#48 8.591   Downloaded hyper v0.14.32
#48 8.633   Downloaded clap_builder v4.5.46
#48 8.667   Downloaded chrono v0.4.41
#48 8.711   Downloaded brotli-decompressor v5.0.0
#48 8.747   Downloaded actix-web v4.11.0
#48 8.776   Downloaded num-conv v0.1.0
#48 8.778   Downloaded matchers v0.2.0
#48 8.780   Downloaded match_cfg v0.1.0
#48 8.782   Downloaded local-waker v0.1.4
#48 8.784   Downloaded local-channel v0.1.5
#48 8.786   Downloaded zerofrom v0.1.6
#48 8.788   Downloaded yoke-derive v0.8.0
#48 8.791   Downloaded want v0.3.1
#48 8.793   Downloaded try-lock v0.2.5
#48 8.796   Downloaded toml v0.8.23
#48 8.802   Downloaded tokio-rustls v0.24.1
#48 8.807   Downloaded http v0.2.12
#48 8.817   Downloaded hashbrown v0.15.5
#48 8.848   Downloaded hashbrown v0.14.5
#48 8.860   Downloaded hashbrown v0.12.3
#48 8.870   Downloaded h2 v0.3.27
#48 8.881   Downloaded futures-util v0.3.31
#48 8.905   Downloaded flate2 v1.1.2
#48 8.912   Downloaded derive_more-impl v2.0.1
#48 8.920   Downloaded cc v1.2.34
#48 8.943   Downloaded bollard v0.15.0
#48 8.963   Downloaded aho-corasick v1.1.3
#48 8.989   Downloaded actix-http v3.11.1
#48 9.020   Downloaded toml_datetime v0.6.11
#48 9.026   Downloaded tokio-native-tls v0.3.1
#48 9.037   Downloaded tokio-macros v2.5.0
#48 9.040   Downloaded icu_properties v2.0.1
#48 9.044   Downloaded icu_normalizer_data v2.0.0
#48 9.049   Downloaded icu_normalizer v2.0.0
#48 9.073   Downloaded icu_locale_core v2.0.0
#48 9.083   Downloaded icu_collections v2.0.0
#48 9.095   Downloaded iana-time-zone v0.1.63
#48 9.101   Downloaded hyper-rustls v0.24.2
#48 9.109   Downloaded httparse v1.10.1
#48 9.113   Downloaded hashlink v0.8.4
#48 9.119   Downloaded getrandom v0.3.3
#48 9.124   Downloaded getrandom v0.2.16
#48 9.129   Downloaded futures-task v0.3.31
#48 9.134   Downloaded futures-channel v0.3.31
#48 9.138   Downloaded dyn-clone v1.0.20
#48 9.141   Downloaded displaydoc v0.2.5
#48 9.146   Downloaded digest v0.10.7
#48 9.150   Downloaded derive_more v2.0.1
#48 9.165   Downloaded crc32fast v1.5.0
#48 9.169   Downloaded cookie v0.16.2
#48 9.173   Downloaded config v0.14.1
#48 9.183   Downloaded clap_derive v4.5.45
#48 9.193   Downloaded clap v4.5.46
#48 9.213   Downloaded bytes v1.10.1
#48 9.226   Downloaded bitflags v2.9.3
#48 9.239   Downloaded base64 v0.22.1
#48 9.253   Downloaded base64 v0.21.7
#48 9.266   Downloaded allocator-api2 v0.2.21
#48 9.275   Downloaded thread_local v1.1.9
#48 9.278   Downloaded thiserror-impl v2.0.16
#48 9.285   Downloaded thiserror-impl v1.0.69
#48 9.294   Downloaded hyperlocal v0.8.0
#48 9.301   Downloaded hyper-tls v0.5.0
#48 9.308   Downloaded httpdate v1.0.3
#48 9.310   Downloaded http-body v0.4.6
#48 9.317   Downloaded hostname v0.3.1
#48 9.320   Downloaded hex v0.4.3
#48 9.327   Downloaded heck v0.5.0
#48 9.338   Downloaded generic-array v0.14.7
#48 9.341   Downloaded futures-sink v0.3.31
#48 9.348   Downloaded futures-macro v0.3.31
#48 9.350   Downloaded futures-core v0.3.31
#48 9.352   Downloaded form_urlencoded v1.2.2
#48 9.359   Downloaded foreign-types-shared v0.1.1
#48 9.360   Downloaded foreign-types v0.3.2
#48 9.364   Downloaded foldhash v0.1.5
#48 9.366   Downloaded fnv v1.0.7
#48 9.370   Downloaded equivalent v1.0.2
#48 9.372   Downloaded dlv-list v0.5.2
#48 9.377   Downloaded dirs-sys v0.4.1
#48 9.382   Downloaded dirs v5.0.1
#48 9.385   Downloaded deranged v0.5.2
#48 9.390   Downloaded crypto-common v0.1.6
#48 9.393   Downloaded crunchy v0.2.4
#48 9.397   Downloaded cpufeatures v0.2.17
#48 9.402   Downloaded convert_case v0.6.0
#48 9.405   Downloaded const-random-macro v0.1.16
#48 9.409   Downloaded const-random v0.1.18
#48 9.411   Downloaded colorchoice v1.0.4
#48 9.416   Downloaded clap_lex v0.7.5
#48 9.418   Downloaded cfg-if v1.0.3
#48 9.425   Downloaded bytestring v1.4.0
#48 9.427   Downloaded bollard-stubs v1.43.0-rc.2
#48 9.435   Downloaded block-buffer v0.10.4
#48 9.441   Downloaded autocfg v1.5.0
#48 9.445   Downloaded async-trait v0.1.89
#48 9.461   Downloaded arraydeque v0.5.1
#48 9.466   Downloaded anyhow v1.0.99
#48 9.481   Downloaded anstyle-query v1.1.4
#48 9.484   Downloaded anstyle-parse v0.2.7
#48 9.490   Downloaded anstyle v1.0.11
#48 9.496   Downloaded anstream v0.6.20
#48 9.511   Downloaded alloc-no-stdlib v2.0.4
#48 9.523   Downloaded ahash v0.8.12
#48 9.530   Downloaded adler2 v2.0.1
#48 9.537   Downloaded actix-web-codegen v4.3.0
#48 9.541   Downloaded actix-service v2.0.3
#48 9.550   Downloaded actix-server v2.6.0
#48 9.565   Downloaded actix-router v0.5.3
#48 9.574   Downloaded actix-rt v2.11.0
#48 9.580   Downloaded actix-cors v0.7.1
#48 9.585   Downloaded actix-macros v0.2.4
#48 9.593   Downloaded actix-codec v0.5.2
#48 9.855    Compiling proc-macro2 v1.0.101
#48 9.865    Compiling unicode-ident v1.0.18
#48 10.38    Compiling cfg-if v1.0.3
#48 10.65    Compiling libc v0.2.175
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 1.013     Updating crates.io index
#52 4.345  Downloading crates ...
#52 4.462   Downloaded actix-cors v0.7.1
#52 4.525   Downloaded generic-array v0.14.7
#52 4.586   Downloaded yoke-derive v0.8.0
#52 4.634   Downloaded pkg-config v0.3.32
#52 4.667   Downloaded scopeguard v1.2.0
#52 4.681   Downloaded spki v0.7.3
#52 4.707   Downloaded spin v0.9.8
#52 4.731   Downloaded socket2 v0.6.0
#52 4.751   Downloaded sqlx-macros v0.8.6
#52 4.764   Downloaded num-bigint-dig v0.8.4
#52 4.788   Downloaded sqlx-macros-core v0.8.6
#52 4.805   Downloaded sqlx-core v0.8.6
#52 4.848   Downloaded serde_json v1.0.143
#52 4.887   Downloaded syn v2.0.106
#52 4.935   Downloaded sqlx v0.8.6
#52 4.971   Downloaded vcpkg v0.2.15
#52 5.097   Downloaded regex-syntax v0.8.6
#52 5.132   Downloaded zerocopy v0.8.26
#52 5.199   Downloaded rustls v0.23.31
#52 5.233   Downloaded openssl v0.10.73
#52 5.264   Downloaded webpki-***s v1.0.2
#52 5.277   Downloaded tracing-subscriber v0.3.20
#52 5.302   Downloaded reqwest v0.11.27
#52 5.327   Downloaded regex-automata v0.4.10
#52 5.390   Downloaded regex v1.11.2
#52 5.424   Downloaded brotli v8.0.2
#52 5.496   Downloaded libm v0.2.15
#52 5.540   Downloaded idna v1.1.0
#52 5.547   Downloaded sqlx-mysql v0.8.6
#52 5.568   Downloaded actix-web v4.11.0
#52 5.600   Downloaded serde v1.0.219
#52 5.614   Downloaded tokio-util v0.7.16
#52 5.643   Downloaded unicode-normalization v0.1.24
#52 5.659   Downloaded hyper v0.14.32
#52 5.684   Downloaded chrono v0.4.41
#52 5.710   Downloaded rustls-webpki v0.103.4
#52 5.728   Downloaded sqlx-postgres v0.8.6
#52 5.777   Downloaded rand v0.9.2
#52 5.793   Downloaded num-bigint v0.4.6
#52 5.803   Downloaded mio v1.0.4
#52 5.827   Downloaded encoding_rs v0.8.35
#52 5.903   Downloaded memchr v2.7.5
#52 5.923   Downloaded url v2.5.7
#52 5.934   Downloaded sqlx-sqlite v0.8.6
#52 5.948   Downloaded libc v0.2.175
#52 6.028   Downloaded tokio v1.47.1
#52 6.148   Downloaded ring v0.17.14
#52 6.285   Downloaded zstd-sys v2.0.15+zstd.1.5.7
#52 6.348   Downloaded time v0.3.41
#52 6.375   Downloaded hkdf v0.12.4
#52 6.389   Downloaded futures-util v0.3.31
#52 6.428   Downloaded brotli-decompressor v5.0.0
#52 6.447   Downloaded socket2 v0.5.10
#52 6.452   Downloaded socket2 v0.4.10
#52 6.460   Downloaded sharded-slab v0.1.7
#52 6.473   Downloaded redis v0.24.0
#52 6.498   Downloaded sha2 v0.10.9
#52 6.505   Downloaded rsa v0.9.8
#52 6.523   Downloaded regex-lite v0.1.7
#52 6.533   Downloaded rand v0.8.5
#52 6.540   Downloaded tracing v0.1.41
#52 6.553   Downloaded icu_properties_data v2.0.1
#52 6.588   Downloaded h2 v0.3.27
#52 6.660   Downloaded smallvec v1.15.1
#52 6.664   Downloaded serde_derive v1.0.219
#52 6.676   Downloaded ryu v1.0.20
#52 6.688   Downloaded rustls-pki-types v1.12.0
#52 6.711   Downloaded parking_lot v0.12.4
#52 6.725   Downloaded openssl-sys v0.9.109
#52 6.737   Downloaded num-traits v0.2.19
#52 6.749   Downloaded log v0.4.27
#52 6.761   Downloaded zerovec v0.11.4
#52 6.779   Downloaded zerotrie v0.2.2
#52 6.786   Downloaded typenum v1.18.0
#52 6.812   Downloaded tracing-core v0.1.34
#52 6.817   Downloaded hashbrown v0.15.5
#52 6.849   Downloaded combine v4.6.7
#52 6.874   Downloaded aho-corasick v1.1.3
#52 6.902   Downloaded slab v0.4.11
#52 6.905   Downloaded simple_asn1 v0.6.3
#52 6.908   Downloaded signature v2.2.0
#52 6.916   Downloaded signal-hook-registry v1.4.6
#52 6.923   Downloaded shlex v1.3.0
#52 6.928   Downloaded sha1_smol v1.0.1
#52 6.936   Downloaded sha1 v0.10.6
#52 6.939   Downloaded serde_urlencoded v0.7.1
#52 6.952   Downloaded rustls-pemfile v1.0.4
#52 6.961   Downloaded rand_core v0.9.3
#52 6.964   Downloaded proc-macro2 v1.0.101
#52 6.972   Downloaded pkcs1 v0.7.5
#52 6.987   Downloaded pin-project v1.1.10
#52 7.025   Downloaded jsonwebtoken v9.3.1
#52 7.031   Downloaded uuid v1.18.0
#52 7.047   Downloaded unicode-bidi v0.3.18
#52 7.058   Downloaded tracing-attributes v0.1.30
#52 7.063   Downloaded tokio-stream v0.1.17
#52 7.076   Downloaded rand_core v0.6.4
#52 7.088   Downloaded rand_chacha v0.9.0
#52 7.091   Downloaded rand_chacha v0.3.1
#52 7.104   Downloaded quote v1.0.40
#52 7.108   Downloaded ppv-lite86 v0.2.21
#52 7.112   Downloaded powerfmt v0.2.0
#52 7.115   Downloaded potential_utf v0.1.3
#52 7.126   Downloaded pkcs8 v0.10.2
#52 7.131   Downloaded pin-project-lite v0.2.16
#52 7.144   Downloaded pin-project-internal v1.1.10
#52 7.153   Downloaded percent-encoding v2.3.2
#52 7.159   Downloaded pem v3.0.5
#52 7.163   Downloaded parking_lot_core v0.9.11
#52 7.177   Downloaded parking v2.2.1
#52 7.180   Downloaded once_cell v1.21.3
#52 7.185   Downloaded num-integer v0.1.46
#52 7.192   Downloaded nu-ansi-term v0.50.1
#52 7.197   Downloaded native-tls v0.2.14
#52 7.209   Downloaded miniz_oxide v0.8.9
#52 7.221   Downloaded mime v0.3.17
#52 7.226   Downloaded md-5 v0.10.6
#52 7.237   Downloaded lock_api v0.4.13
#52 7.240   Downloaded litemap v0.8.0
#52 7.247   Downloaded lazy_static v1.5.0
#52 7.256   Downloaded jobserver v0.1.34
#52 7.260   Downloaded itoa v1.0.15
#52 7.267   Downloaded ipnet v2.11.0
#52 7.271   Downloaded inout v0.1.4
#52 7.274   Downloaded indexmap v2.11.0
#52 7.283   Downloaded zstd-safe v7.2.4
#52 7.292   Downloaded zstd v0.13.3
#52 7.296   Downloaded zeroize v1.8.1
#52 7.305   Downloaded yoke v0.8.0
#52 7.313   Downloaded writeable v0.6.1
#52 7.328   Downloaded whoami v1.6.1
#52 7.335   Downloaded utf8_iter v1.0.4
#52 7.340   Downloaded untrusted v0.9.0
#52 7.343   Downloaded unicode-xid v0.2.6
#52 7.355   Downloaded unicode-properties v0.1.3
#52 7.366   Downloaded unicode-ident v1.0.18
#52 7.385   Downloaded tracing-log v0.2.0
#52 7.385   Downloaded tinyvec v1.10.0
#52 7.391   Downloaded thiserror-impl v2.0.16
#52 7.406   Downloaded thiserror v2.0.16
#52 7.420   Downloaded subtle v2.6.1
#52 7.430   Downloaded stringprep v0.1.5
#52 7.439   Downloaded icu_properties v2.0.1
#52 7.445   Downloaded icu_normalizer_data v2.0.0
#52 7.455   Downloaded icu_normalizer v2.0.0
#52 7.473   Downloaded icu_locale_core v2.0.0
#52 7.494   Downloaded icu_collections v2.0.0
#52 7.509   Downloaded http v0.2.12
#52 7.525   Downloaded hmac v0.12.1
#52 7.532   Downloaded futures-intrusive v0.5.0
#52 7.554   Downloaded flume v0.11.1
#52 7.563   Downloaded flate2 v1.1.2
#52 7.585   Downloaded derive_more-impl v2.0.1
#52 7.597   Downloaded derive_more v2.0.1
#52 7.633   Downloaded der v0.7.10
#52 7.655   Downloaded cc v1.2.34
#52 7.676   Downloaded bytes v1.10.1
#52 7.687   Downloaded actix-http v3.11.1
#52 7.722   Downloaded pin-utils v0.1.0
#52 7.725   Downloaded pem-rfc7468 v0.7.0
#52 7.730   Downloaded openssl-probe v0.1.6
#52 7.741   Downloaded openssl-macros v0.1.1
#52 7.743   Downloaded num-iter v0.1.45
#52 7.746   Downloaded num-conv v0.1.0
#52 7.748   Downloaded matchers v0.2.0
#52 7.760   Downloaded local-waker v0.1.4
#52 7.763   Downloaded local-channel v0.1.5
#52 7.765   Downloaded language-tags v0.3.2
#52 7.778   Downloaded impl-more v0.1.9
#52 7.784   Downloaded idna_adapter v1.2.1
#52 7.787   Downloaded zerovec-derive v0.11.1
#52 7.791   Downloaded zerofrom-derive v0.1.6
#52 7.800   Downloaded zerofrom v0.1.6
#52 7.803   Downloaded webpki-***s v0.26.11
#52 7.810   Downloaded want v0.3.1
#52 7.819   Downloaded version_check v0.9.5
#52 7.823   Downloaded try-lock v0.2.5
#52 7.825   Downloaded tower-service v0.3.3
#52 7.828   Downloaded tokio-native-tls v0.3.1
#52 7.837   Downloaded tokio-macros v2.5.0
#52 7.840   Downloaded tinystr v0.8.1
#52 7.854   Downloaded time-macros v0.2.22
#52 7.861   Downloaded time-core v0.1.4
#52 7.873   Downloaded thread_local v1.1.9
#52 7.878   Downloaded synstructure v0.13.2
#52 7.885   Downloaded sync_wrapper v0.1.2
#52 7.891   Downloaded iana-time-zone v0.1.63
#52 7.904   Downloaded httpdate v1.0.3
#52 7.907   Downloaded httparse v1.10.1
#52 7.913   Downloaded hashlink v0.10.0
#52 7.920   Downloaded getrandom v0.3.3
#52 7.927   Downloaded getrandom v0.2.16
#52 7.937   Downloaded futures-channel v0.3.31
#52 7.945   Downloaded futures v0.3.31
#52 7.961   Downloaded event-listener v5.4.1
#52 7.966   Downloaded either v1.15.0
#52 7.981   Downloaded displaydoc v0.2.5
#52 7.987   Downloaded crossbeam-utils v0.8.21
#52 7.993   Downloaded crc32fast v1.5.0
#52 8.000   Downloaded cookie v0.16.2
#52 8.008   Downloaded const-oid v0.9.6
#52 8.012   Downloaded concurrent-queue v2.5.0
#52 8.016   Downloaded bitflags v2.9.3
#52 8.030   Downloaded base64 v0.22.1
#52 8.040   Downloaded base64 v0.21.7
#52 8.048   Downloaded arc-swap v1.7.1
#52 8.060   Downloaded allocator-api2 v0.2.21
#52 8.068   Downloaded tokio-retry v0.3.0
#52 8.071   Downloaded tinyvec_macros v0.1.1
#52 8.075   Downloaded stable_deref_trait v1.2.0
#52 8.078   Downloaded icu_provider v2.0.0
#52 8.085   Downloaded hyper-tls v0.5.0
#52 8.092   Downloaded http-body v0.4.6
#52 8.100   Downloaded home v0.5.11
#52 8.103   Downloaded hex v0.4.3
#52 8.110   Downloaded heck v0.5.0
#52 8.113   Downloaded futures-task v0.3.31
#52 8.116   Downloaded futures-macro v0.3.31
#52 8.118   Downloaded futures-io v0.3.31
#52 8.125   Downloaded futures-executor v0.3.31
#52 8.129   Downloaded futures-core v0.3.31
#52 8.132   Downloaded form_urlencoded v1.2.2
#52 8.135   Downloaded foreign-types-shared v0.1.1
#52 8.138   Downloaded foreign-types v0.3.2
#52 8.141   Downloaded foldhash v0.1.5
#52 8.144   Downloaded fnv v1.0.7
#52 8.147   Downloaded equivalent v1.0.2
#52 8.150   Downloaded dotenvy v0.15.7
#52 8.167   Downloaded deranged v0.4.0
#52 8.174   Downloaded crossbeam-queue v0.3.12
#52 8.180   Downloaded crc-catalog v2.4.0
#52 8.183   Downloaded crc v3.3.0
#52 8.192   Downloaded cpufeatures v0.2.17
#52 8.200   Downloaded cipher v0.4.4
#52 8.208   Downloaded cfg-if v1.0.3
#52 8.212   Downloaded bytestring v1.4.0
#52 8.218   Downloaded byteorder v1.5.0
#52 8.221   Downloaded blowfish v0.9.1
#52 8.233   Downloaded block-buffer v0.10.4
#52 8.235   Downloaded bcrypt v0.15.1
#52 8.239   Downloaded base64ct v1.8.0
#52 8.249   Downloaded autocfg v1.5.0
#52 8.257   Downloaded async-trait v0.1.89
#52 8.275   Downloaded anyhow v1.0.99
#52 8.290   Downloaded actix-web-codegen v4.3.0
#52 8.298   Downloaded actix-utils v3.0.1
#52 8.302   Downloaded actix-service v2.0.3
#52 8.313   Downloaded actix-rt v2.10.0
#52 8.325   Downloaded actix-router v0.5.3
#52 8.331   Downloaded actix-macros v0.2.4
#52 8.335   Downloaded actix-codec v0.5.2
#52 8.348   Downloaded futures-sink v0.3.31
#52 8.350   Downloaded digest v0.10.7
#52 8.359   Downloaded crypto-common v0.1.6
#52 8.362   Downloaded atoi v2.0.0
#52 8.369   Downloaded alloc-stdlib v0.2.2
#52 8.376   Downloaded alloc-no-stdlib v2.0.4
#52 8.383   Downloaded adler2 v2.0.1
#52 8.389   Downloaded actix-server v2.6.0
#52 8.395   Downloaded libsqlite3-sys v0.30.1
#52 9.259    Compiling proc-macro2 v1.0.101
#52 9.282    Compiling unicode-ident v1.0.18
#52 ...
#40 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#40 36.62 Progress: resolved 507, reused 0, downloaded 477, added 135
#40 37.62 Progress: resolved 507, reused 0, downloaded 498, added 141
#40 42.33 Progress: resolved 507, reused 0, downloaded 499, added 141
#40 43.33 Progress: resolved 507, reused 0, downloaded 507, added 374
#40 44.33 Progress: resolved 507, reused 0, downloaded 507, added 498
#40 44.64 Progress: resolved 507, reused 0, downloaded 507, added 507, done
#40 46.37 
#40 46.37 dependencies:
#40 46.37 + @radix-ui/react-accordion 1.2.12
#40 46.37 + @radix-ui/react-dialog 1.1.15
#40 46.37 + @radix-ui/react-dropdown-menu 2.1.16
#40 46.37 + @radix-ui/react-navigation-menu 1.2.14
#40 46.37 + @radix-ui/react-select 2.2.6
#40 46.37 + @radix-ui/react-separator 1.1.7
#40 46.37 + @radix-ui/react-slot 1.2.3
#40 46.37 + @radix-ui/react-switch 1.2.6
#40 46.37 + @radix-ui/react-tabs 1.1.13
#40 46.37 + @radix-ui/react-tooltip 1.2.8
#40 46.37 + class-variance-authority 0.7.1
#40 46.37 + clsx 2.1.1
#40 46.37 + framer-motion 11.18.2
#40 46.37 + lucide-react 0.542.0
#40 46.37 + next 15.5.2
#40 46.37 + next-mdx-remote 5.0.0
#40 46.37 + react 19.1.1
#40 46.37 + react-dom 19.1.1
#40 46.37 + tailwind-merge 3.3.1
#40 46.37 
#40 46.37 devDependencies:
#40 46.37 + @eslint/eslintrc 3.3.1
#40 46.37 + @tailwindcss/postcss 4.1.12
#40 46.37 + @types/node 24.3.0
#40 46.37 + @types/react 19.1.12
#40 46.37 + @types/react-dom 19.1.9
#40 46.37 + eslint 9.34.0
#40 46.37 + eslint-config-next 15.5.2
#40 46.37 + tailwindcss 4.1.12
#40 46.37 + tw-animate-css 1.3.7
#40 46.37 + typescript 5.9.2
#40 46.37 
#40 46.37 ╭ Warning ─────────────────────────────────────────────────────────────────────╮
#40 46.37 │                                                                              │
#40 46.37 │   Ignored build scripts: @tailwindcss/oxide, sharp, unrs-resolver.           │
#40 46.37 │   Run "pnpm approve-builds" to pick which dependencies should be allowed     │
#40 46.37 │   to run scripts.                                                            │
#40 46.37 │                                                                              │
#40 46.37 ╰──────────────────────────────────────────────────────────────────────────────╯
#40 46.37 
#40 46.47 Done in 38s using pnpm v10.15.0
#40 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 10.02    Compiling libc v0.2.175
#52 ...
#40 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#40 DONE 47.6s
#48 [agent builder  6/10] RUN cargo build --release
#48 19.05    Compiling quote v1.0.40
#48 21.25    Compiling syn v2.0.106
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 12.88    Compiling serde v1.0.219
#52 18.73    Compiling quote v1.0.40
#52 21.52    Compiling syn v2.0.106
#52 ...
#41 [frontend builder 4/6] RUN npm install
#41 59.26 
#41 59.26 added 457 packages, and audited 458 packages in 58s
#41 59.26 
#41 59.26 152 packages are looking for funding
#41 59.26   run `npm fund` for details
#41 59.27 
#41 59.27 found 0 vulnerabilities
#41 59.28 npm notice
#41 59.28 npm notice New major version of npm available! 10.9.3 -> 11.5.2
#41 59.28 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.5.2
#41 59.28 npm notice To update run: npm install -g npm@11.5.2
#41 59.28 npm notice
#41 DONE 60.3s
#53 [frontend builder 5/6] COPY . .
#53 DONE 0.1s
#54 [website builder 2/5] COPY --from=deps /app/node_modules ./node_modules
#54 ...
#55 [frontend builder 6/6] RUN npm run build
#55 1.033 
#55 1.033 > frontend@0.1.0 build
#55 1.033 > next build
#55 1.033 
#55 4.447 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#55 4.447 This information is used to shape Next.js' roadmap and prioritize features.
#55 4.447 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#55 4.447 https://nextjs.org/telemetry
#55 4.447 
#55 4.659    ▲ Next.js 15.5.2
#55 4.666 
#55 5.290    Creating an optimized production build ...
#55 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 23.28    Compiling cfg-if v1.0.3
#52 23.65    Compiling autocfg v1.5.0
#52 ...
#54 [website builder 2/5] COPY --from=deps /app/node_modules ./node_modules
#54 DONE 9.2s
#56 [website builder 3/5] COPY . .
#56 DONE 0.1s
#48 [agent builder  6/10] RUN cargo build --release
#48 ...
#57 [website builder 4/5] RUN mkdir -p public
#57 DONE 0.5s
#48 [agent builder  6/10] RUN cargo build --release
#48 ...
#58 [website builder 5/5] RUN npm run build
#58 2.566 
#58 2.566 > viworks@0.1.0 build
#58 2.566 > next build
#58 2.566 
#58 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 43.28    Compiling jobserver v0.1.34
#48 46.03    Compiling shlex v1.3.0
#48 47.22    Compiling cc v1.2.34
#48 ...
#58 [website builder 5/5] RUN npm run build
#58 7.189    ▲ Next.js 15.5.2
#58 7.195 
#58 7.392    Creating an optimized production build ...
#58 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 35.90    Compiling jobserver v0.1.34
#52 38.90    Compiling shlex v1.3.0
#52 40.02    Compiling cc v1.2.34
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 62.65    Compiling serde v1.0.219
#48 64.27    Compiling once_cell v1.21.3
#48 65.90    Compiling autocfg v1.5.0
#48 69.45    Compiling pin-project-lite v0.2.16
#48 69.84    Compiling smallvec v1.15.1
#48 71.82    Compiling log v0.4.27
#48 73.82    Compiling version_check v0.9.5
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 56.01    Compiling version_check v0.9.5
#52 58.40    Compiling typenum v1.18.0
#52 60.43    Compiling generic-array v0.14.7
#52 61.34    Compiling synstructure v0.13.2
#52 66.90    Compiling lock_api v0.4.13
#52 67.78    Compiling parking_lot_core v0.9.11
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 76.26    Compiling bytes v1.10.1
#48 78.22    Compiling serde_derive v1.0.219
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 69.05    Compiling pin-project-lite v0.2.16
#52 69.43    Compiling log v0.4.27
#52 71.12    Compiling memchr v2.7.5
#52 78.10    Compiling serde_derive v1.0.219
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 86.98    Compiling lock_api v0.4.13
#48 88.32    Compiling synstructure v0.13.2
#48 93.29    Compiling parking_lot_core v0.9.11
#48 95.02    Compiling scopeguard v1.2.0
#48 95.43    Compiling pkg-config v0.3.32
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 79.99    Compiling zerofrom-derive v0.1.6
#52 94.01    Compiling yoke-derive v0.8.0
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 107.9    Compiling zerofrom-derive v0.1.6
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 106.7    Compiling zerovec-derive v0.11.1
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 122.1    Compiling futures-core v0.3.31
#48 123.1    Compiling memchr v2.7.5
#48 ...
#55 [frontend builder 6/6] RUN npm run build
#55 97.98  ✓ Compiled successfully in 80s
#55 98.04    Skipping validation of types
#55 98.05    Skipping linting
#55 99.39    Collecting page data ...
#55 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 118.7    Compiling displaydoc v0.2.5
#52 126.3    Compiling bytes v1.10.1
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 137.9    Compiling zerofrom v0.1.6
#48 138.7    Compiling parking_lot v0.12.4
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 133.6    Compiling futures-core v0.3.31
#52 134.7    Compiling scopeguard v1.2.0
#52 135.1    Compiling icu_normalizer_data v2.0.0
#52 136.0    Compiling icu_properties_data v2.0.1
#52 139.1    Compiling tracing-attributes v0.1.30
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 147.2    Compiling yoke-derive v0.8.0
#48 148.0    Compiling tokio-macros v2.5.0
#48 ...
#55 [frontend builder 6/6] RUN npm run build
#55 109.5    Generating static pages (0/6) ...
#55 115.0    Generating static pages (1/6) 
#55 115.0    Generating static pages (2/6) 
#55 115.0    Generating static pages (4/6) 
#55 115.0  ✓ Generating static pages (6/6)
#55 117.7    Finalizing page optimization ...
#55 117.7    Collecting build traces ...
#55 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 153.5    Compiling mio v1.0.4
#48 156.6    Compiling socket2 v0.6.0
#48 160.5    Compiling signal-hook-registry v1.4.6
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 146.1    Compiling smallvec v1.15.1
#52 150.4    Compiling zerocopy v0.8.26
#52 150.8    Compiling parking_lot v0.12.4
#52 153.5    Compiling once_cell v1.21.3
#52 155.2    Compiling zerofrom v0.1.6
#52 155.9    Compiling tokio-macros v2.5.0
#52 156.8    Compiling mio v1.0.4
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 167.1    Compiling stable_deref_trait v1.2.0
#48 167.4    Compiling yoke v0.8.0
#48 167.5    Compiling tokio v1.47.1
#48 168.9    Compiling tracing-core v0.1.34
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 161.7    Compiling socket2 v0.6.0
#52 162.0    Compiling signal-hook-registry v1.4.6
#52 166.3    Compiling futures-sink v0.3.31
#52 166.8    Compiling stable_deref_trait v1.2.0
#52 167.1    Compiling itoa v1.0.15
#52 167.6    Compiling yoke v0.8.0
#52 169.5    Compiling tokio v1.47.1
#52 ...
#58 [website builder 5/5] RUN npm run build
#58 127.3  ✓ Compiled successfully in 106s
#58 127.3    Linting and checking validity of types ...
#58 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 180.2    Compiling itoa v1.0.15
#48 181.2    Compiling tracing-attributes v0.1.30
#48 194.2    Compiling zerovec-derive v0.11.1
#48 205.4    Compiling zerocopy v0.8.26
#48 208.4    Compiling zerovec v0.11.4
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 202.9    Compiling pkg-config v0.3.32
#52 ...
#55 [frontend builder 6/6] RUN npm run build
#55 187.1 
#55 187.2 Route (app)                                 Size  First Load JS
#55 187.2 ┌ ○ /                                    67.9 kB         211 kB
#55 187.2 ├ ○ /_not-found                            991 B         103 kB
#55 187.2 └ ○ /login                               23.9 kB         157 kB
#55 187.2 + First Load JS shared by all             102 kB
#55 187.2   ├ chunks/255-310f1cc3c9beb704.js       45.7 kB
#55 187.2   ├ chunks/4bd1b696-c023c6e3521b1417.js  54.2 kB
#55 187.2   └ other shared chunks (total)          1.93 kB
#55 187.2 
#55 187.2 
#55 187.2 ○  (Static)  prerendered as static content
#55 187.2 
#55 DONE 187.7s
#58 [website builder 5/5] RUN npm run build
#58 172.3 
#58 172.3 ./app/login/page.tsx
#58 172.3 22:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
#58 172.3 
#58 172.3 ./app/page.tsx
#58 172.3 7:10  Warning: 'PainPoints' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/common/Footer.tsx
#58 172.3 4:7  Warning: 'footerLinks' is assigned a value but never used.  @typescript-eslint/no-unused-vars
#58 172.3 42:7  Warning: 'complianceBadges' is assigned a value but never used.  @typescript-eslint/no-unused-vars
#58 172.3 62:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
#58 172.3 84:44  Warning: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/common/Header.tsx
#58 172.3 84:51  Warning: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 109:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
#58 172.3 
#58 172.3 ./components/common/NdaCta.tsx
#58 172.3 4:10  Warning: 'Badge' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/marketing/ClosingCta.tsx
#58 172.3 3:10  Warning: 'motion' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 4:10  Warning: 'Badge' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 5:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 6:10  Warning: 'ArrowRight' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 6:22  Warning: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 6:30  Warning: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 6:37  Warning: 'Zap' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/marketing/DeploymentOptions.tsx
#58 172.3 5:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 12:3  Warning: 'ArrowRight' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 18:8  Warning: 'Link' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/marketing/FAQAccordion.tsx
#58 172.3 10:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 11:10  Warning: 'MessageSquare' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 11:25  Warning: 'ArrowRight' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 13:8  Warning: 'Link' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 93:31  Warning: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/marketing/FeatureGrid.tsx
#58 172.3 14:3  Warning: 'ArrowRight' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 113:27  Warning: 'type' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/marketing/Hero.tsx
#58 172.3 5:34  Warning: 'Play' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 5:40  Warning: 'Star' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 5:46  Warning: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 5:53  Warning: 'Globe' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 5:80  Warning: 'ArrowRight' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/marketing/HowItWorks.tsx
#58 172.3 5:44  Warning: 'CheckCircle' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 61:31  Warning: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/marketing/Integrations.tsx
#58 172.3 5:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 8:3  Warning: 'ArrowRight' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 10:3  Warning: 'Globe' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 11:3  Warning: 'Building' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 15:8  Warning: 'Link' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 184:64  Warning: 'integrationIndex' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/marketing/PainPoints.tsx
#58 172.3 11:3  Warning: 'Zap' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 13:3  Warning: 'Globe' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 14:3  Warning: 'CheckCircle' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 15:3  Warning: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 16:3  Warning: 'ArrowRight' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 100:27  Warning: 'type' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/marketing/PlatformCompatibility.tsx
#58 172.3 5:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 12:3  Warning: 'Chrome' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 16:3  Warning: 'Zap' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 18:8  Warning: 'Link' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/marketing/SecurityHighlights.tsx
#58 172.3 64:45  Warning: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/marketing/TrustBar.tsx
#58 172.3 11:3  Warning: 'Building' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 15:3  Warning: 'ArrowRight' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 114:27  Warning: 'type' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/marketing/UseCases.tsx
#58 172.3 8:3  Warning: 'Building' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 12:3  Warning: 'Lock' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 13:3  Warning: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 14:3  Warning: 'Zap' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 15:3  Warning: 'ArrowRight' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 20:3  Warning: 'Gavel' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 233:33  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/portal/DashboardCards.tsx
#58 172.3 3:10  Warning: 'Card' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 3:16  Warning: 'CardContent' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 3:29  Warning: 'CardHeader' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 3:41  Warning: 'CardTitle' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 14:3  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 15:3  Warning: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 16:3  Warning: 'Activity' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/portal/PortalHeader.tsx
#58 172.3 120:15  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
#58 172.3 
#58 172.3 ./components/portal/TicketList.tsx
#58 172.3 14:3  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/product/ComparisonTable.tsx
#58 172.3 121:39  Warning: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/product/ProductIntro.tsx
#58 172.3 6:29  Warning: 'Monitor' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/solutions/IndustryGrid.tsx
#58 172.3 8:17  Warning: 'Eye' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 8:22  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 8:32  Warning: 'Lock' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 8:48  Warning: 'Globe' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/solutions/Playbooks.tsx
#58 172.3 82:50  Warning: 'featureIndex' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 ./components/solutions/ReferenceBlueprints.tsx
#58 172.3 6:25  Warning: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
#58 172.3 
#58 172.3 info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
#58 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 220.6    Compiling tracing v0.1.41
#48 ...
#59 [frontend runner 5/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#59 DONE 1.1s
#60 [frontend runner 6/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#60 DONE 0.0s
#61 [frontend runner 7/7] RUN mkdir -p ./public
#61 DONE 0.6s
#48 [agent builder  6/10] RUN cargo build --release
#48 ...
#62 [frontend] exporting to image
#62 exporting layers 2.0s done
#62 writing image sha256:5df242396420b99f980135e561ed081c939e3a76f937599d1f50f5dd9ca28d95 done
#62 naming to docker.io/library/digitaloceandocker-frontend 0.0s done
#62 DONE 2.0s
#63 [frontend] resolving provenance for metadata file
#63 DONE 0.0s
#48 [agent builder  6/10] RUN cargo build --release
#48 225.6    Compiling displaydoc v0.2.5
#48 232.1    Compiling hashbrown v0.15.5
#48 ...
#58 [website builder 5/5] RUN npm run build
#58 194.0    Collecting page data ...
#58 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 218.9    Compiling zerovec v0.11.4
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 239.0    Compiling equivalent v1.0.2
#48 239.4    Compiling indexmap v2.11.0
#48 ...
#58 [website builder 5/5] RUN npm run build
#58 203.2    Generating static pages (0/21) ...
#58 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 231.3    Compiling crossbeam-utils v0.8.21
#52 232.8    Compiling tracing-core v0.1.34
#52 ...
#58 [website builder 5/5] RUN npm run build
#58 210.0    Generating static pages (5/21) 
#58 211.4    Generating static pages (10/21) 
#58 211.4    Generating static pages (15/21) 
#58 211.7  ✓ Generating static pages (21/21)
#58 213.7    Finalizing page optimization ...
#58 213.7    Collecting build traces ...
#58 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 248.2    Compiling crypto-common v0.1.6
#52 248.6    Compiling futures-channel v0.3.31
#52 250.1    Compiling futures-macro v0.3.31
#52 252.1    Compiling slab v0.4.11
#52 253.4    Compiling serde_json v1.0.143
#52 254.3    Compiling futures-task v0.3.31
#52 254.9    Compiling futures-io v0.3.31
#52 255.0    Compiling pin-utils v0.1.0
#52 255.2    Compiling tracing v0.1.41
#52 255.7    Compiling futures-util v0.3.31
#52 257.1    Compiling tinystr v0.8.1
#52 258.4    Compiling subtle v2.6.1
#52 259.4    Compiling litemap v0.8.0
#52 260.9    Compiling writeable v0.6.1
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 260.7    Compiling fnv v1.0.7
#48 261.1    Compiling futures-sink v0.3.31
#48 261.5    Compiling http v0.2.12
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 263.4    Compiling icu_locale_core v2.0.0
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 276.0    Compiling bitflags v2.9.3
#48 278.7    Compiling futures-macro v0.3.31
#48 284.1    Compiling futures-task v0.3.31
#48 285.1    Compiling slab v0.4.11
#48 286.5    Compiling pin-utils v0.1.0
#48 286.7    Compiling futures-util v0.3.31
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 280.6    Compiling potential_utf v0.1.3
#52 281.4    Compiling zerotrie v0.2.2
#52 281.8    Compiling getrandom v0.2.16
#52 282.9    Compiling foldhash v0.1.5
#52 284.0    Compiling allocator-api2 v0.2.21
#52 284.1    Compiling thiserror v2.0.16
#52 285.8    Compiling equivalent v1.0.2
#52 286.2    Compiling icu_provider v2.0.0
#52 287.9    Compiling hashbrown v0.15.5
#52 293.9    Compiling icu_collections v2.0.0
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 305.5    Compiling tokio-util v0.7.16
#48 307.1    Compiling tinystr v0.8.1
#48 308.3    Compiling thiserror v2.0.16
#48 309.7    Compiling writeable v0.6.1
#48 ...
#58 [website builder 5/5] RUN npm run build
#58 267.7 
#58 267.7 Route (app)                                 Size  First Load JS
#58 267.7 ┌ ○ /                                      26 kB         197 kB
#58 267.7 ├ ○ /_not-found                            130 B         102 kB
#58 267.7 ├ ƒ /contact                             20.1 kB         188 kB
#58 267.7 ├ ○ /login                               3.99 kB         134 kB
#58 267.7 ├ ○ /portal                              4.46 kB         123 kB
#58 267.7 ├ ○ /portal/contracts                    4.78 kB         116 kB
#58 267.7 ├ ○ /portal/contracts/renewal            5.37 kB         116 kB
#58 267.7 ├ ○ /portal/downloads                       5 kB         116 kB
#58 267.7 ├ ○ /portal/invoices                     4.99 kB         116 kB
#58 267.7 ├ ○ /portal/notifications                7.81 kB         119 kB
#58 267.7 ├ ○ /portal/settings                     7.82 kB         119 kB
#58 267.7 ├ ○ /portal/sla-reports                  4.67 kB         116 kB
#58 267.7 ├ ○ /portal/tickets                      2.23 kB         121 kB
#58 267.7 ├ ○ /portal/tickets/new                  5.11 kB         116 kB
#58 267.7 ├ ○ /portal/users                        5.12 kB         116 kB
#58 267.7 ├ ○ /product                             11.2 kB         182 kB
#58 267.7 ├ ○ /solutions                           9.12 kB         180 kB
#58 267.7 └ ○ /test                                  130 B         102 kB
#58 267.7 + First Load JS shared by all             102 kB
#58 267.7   ├ chunks/2c913ea3-f77b522ca87815ac.js  54.2 kB
#58 267.7   ├ chunks/341-2d546ef92ef35bc1.js       45.3 kB
#58 267.7   └ other shared chunks (total)          1.94 kB
#58 267.7 
#58 267.7 
#58 267.7 ○  (Static)   prerendered as static content
#58 267.7 ƒ  (Dynamic)  server-rendered on demand
#58 267.7 
#58 267.8 npm notice
#58 267.8 npm notice New major version of npm available! 10.8.2 -> 11.5.2
#58 267.8 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.5.2
#58 267.8 npm notice To update run: npm install -g npm@11.5.2
#58 267.8 npm notice
#58 DONE 268.0s
#52 [backend builder  7/11] RUN cargo build --release
#52 299.5    Compiling block-buffer v0.10.4
#52 301.7    Compiling getrandom v0.3.3
#52 ...
#64 [website runner 4/8] COPY --from=builder /app/public ./public
#64 DONE 0.2s
#65 [website runner 5/8] RUN mkdir .next
#65 DONE 0.4s
#66 [website runner 6/8] RUN chown nextjs:nodejs .next
#66 DONE 0.4s
#52 [backend builder  7/11] RUN cargo build --release
#52 305.3    Compiling percent-encoding v2.3.2
#52 ...
#67 [website runner 7/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#67 DONE 0.8s
#68 [website runner 8/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#68 DONE 0.1s
#48 [agent builder  6/10] RUN cargo build --release
#48 313.0    Compiling litemap v0.8.0
#48 313.7    Compiling httparse v1.10.1
#48 314.6    Compiling icu_locale_core v2.0.0
#48 315.2    Compiling zerotrie v0.2.2
#48 ...
#69 [website] exporting to image
#69 exporting layers 1.7s done
#69 writing image sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a done
#69 naming to docker.io/library/digitaloceandocker-website done
#69 DONE 1.7s
#70 [website] resolving provenance for metadata file
#70 DONE 0.0s
#52 [backend builder  7/11] RUN cargo build --release
#52 310.2    Compiling ppv-lite86 v0.2.21
#52 312.6    Compiling digest v0.10.7
#52 314.4    Compiling thiserror-impl v2.0.16
#52 314.8    Compiling num-traits v0.2.19
#52 315.4    Compiling bitflags v2.9.3
#52 316.3    Compiling rustls v0.23.31
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 317.7    Compiling potential_utf v0.1.3
#48 318.1    Compiling icu_normalizer_data v2.0.0
#48 318.7    Compiling vcpkg v0.2.15
#48 321.4    Compiling icu_properties_data v2.0.1
#48 321.9    Compiling typenum v1.18.0
#48 323.0    Compiling openssl-sys v0.9.109
#48 324.9    Compiling icu_provider v2.0.0
#48 326.6    Compiling icu_collections v2.0.0
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 319.8    Compiling icu_properties v2.0.1
#52 320.6    Compiling icu_normalizer v2.0.0
#52 327.6    Compiling indexmap v2.11.0
#52 327.9    Compiling tokio-util v0.7.16
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 329.7    Compiling h2 v0.3.27
#48 331.1    Compiling thiserror-impl v2.0.16
#48 337.2    Compiling generic-array v0.14.7
#48 337.7    Compiling ring v0.17.14
#48 339.7    Compiling socket2 v0.5.10
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 331.9    Compiling ring v0.17.14
#52 332.8    Compiling zeroize v1.8.1
#52 333.5    Compiling ryu v1.0.20
#52 334.6    Compiling fnv v1.0.7
#52 334.7    Compiling vcpkg v0.2.15
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 345.3    Compiling crunchy v0.2.4
#48 346.0    Compiling getrandom v0.3.3
#48 346.7    Compiling percent-encoding v2.3.2
#48 347.8    Compiling httpdate v1.0.3
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 337.9    Compiling openssl-sys v0.9.109
#52 339.7    Compiling http v0.2.12
#52 345.5    Compiling rustls-pki-types v1.12.0
#52 347.8    Compiling idna_adapter v1.2.1
#52 348.5    Compiling form_urlencoded v1.2.2
#52 352.5    Compiling base64 v0.22.1
#52 352.8    Compiling utf8_iter v1.0.4
#52 353.3    Compiling idna v1.1.0
#52 368.6    Compiling zstd-sys v2.0.15+zstd.1.5.7
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 380.0    Compiling zstd-sys v2.0.15+zstd.1.5.7
#48 381.0    Compiling ahash v0.8.12
#48 381.4    Compiling tiny-keccak v2.0.2
#48 385.8    Compiling icu_properties v2.0.1
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 372.3    Compiling untrusted v0.9.0
#52 372.5    Compiling cpufeatures v0.2.17
#52 372.7    Compiling httparse v1.10.1
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 394.1    Compiling icu_normalizer v2.0.0
#48 404.6    Compiling aho-corasick v1.1.3
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 401.5    Compiling url v2.5.7
#52 418.0    Compiling aho-corasick v1.1.3
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 439.5    Compiling getrandom v0.2.16
#48 440.4    Compiling serde_json v1.0.143
#48 441.0    Compiling regex-syntax v0.8.6
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 438.2    Compiling num-conv v0.1.0
#52 438.8    Compiling powerfmt v0.2.0
#52 441.0    Compiling time-core v0.1.4
#52 441.3    Compiling regex-syntax v0.8.6
#52 464.5    Compiling tinyvec_macros v0.1.1
#52 467.6    Compiling tinyvec v1.10.0
#52 472.2    Compiling regex-automata v0.4.10
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 485.2    Compiling try-lock v0.2.5
#48 485.4    Compiling ryu v1.0.20
#48 486.6    Compiling untrusted v0.9.0
#48 507.7    Compiling want v0.3.1
#48 508.1    Compiling regex-automata v0.4.10
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 512.5    Compiling time-macros v0.2.22
#52 532.0    Compiling deranged v0.4.0
#52 548.6    Compiling rustls-webpki v0.103.4
#52 555.3    Compiling concurrent-queue v2.5.0
#52 556.1    Compiling webpki-***s v1.0.2
#52 556.5    Compiling h2 v0.3.27
#52 559.4    Compiling rand_core v0.6.4
#52 561.6    Compiling socket2 v0.5.10
#52 575.1    Compiling crc32fast v1.5.0
#52 576.1    Compiling zstd-safe v7.2.4
#52 576.8    Compiling iana-time-zone v0.1.63
#52 577.7    Compiling parking v2.2.1
#52 578.2    Compiling local-waker v0.1.4
#52 578.9    Compiling alloc-no-stdlib v2.0.4
#52 579.7    Compiling openssl v0.10.73
#52 580.7    Compiling httpdate v1.0.3
#52 581.8    Compiling foreign-types-shared v0.1.1
#52 582.0    Compiling crc-catalog v2.4.0
#52 583.3    Compiling time v0.3.41
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 599.0    Compiling idna_adapter v1.2.1
#48 600.1    Compiling form_urlencoded v1.2.2
#48 601.9    Compiling http-body v0.4.6
#48 602.5    Compiling futures-channel v0.3.31
#48 603.4    Compiling encoding_rs v0.8.35
#48 603.5    Compiling zstd-safe v7.2.4
#48 604.2    Compiling local-waker v0.1.4
#48 604.5    Compiling utf8_iter v1.0.4
#48 605.1    Compiling openssl v0.10.73
#48 605.9    Compiling crc32fast v1.5.0
#48 606.7    Compiling allocator-api2 v0.2.21
#48 608.8    Compiling ucd-trie v0.1.7
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 602.3    Compiling crc v3.3.0
#52 603.0    Compiling foreign-types v0.3.2
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 613.1    Compiling foreign-types-shared v0.1.1
#48 613.2    Compiling tower-service v0.3.3
#48 613.9    Compiling alloc-no-stdlib v2.0.4
#48 615.2    Compiling alloc-stdlib v0.2.2
#48 615.5    Compiling const-random-macro v0.1.16
#48 616.6    Compiling hyper v0.14.32
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 608.5    Compiling alloc-stdlib v0.2.2
#52 608.9    Compiling sha2 v0.10.9
#52 610.5    Compiling event-listener v5.4.1
#52 611.5    Compiling chrono v0.4.41
#52 618.1    Compiling rand_chacha v0.3.1
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 629.1    Compiling foreign-types v0.3.2
#48 629.3    Compiling pest v2.8.1
#48 635.5    Compiling hashbrown v0.14.5
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 621.5    Compiling webpki-***s v0.26.11
#52 621.6    Compiling tokio-stream v0.1.17
#52 623.6    Compiling futures-intrusive v0.5.0
#52 630.1    Compiling unicode-normalization v0.1.24
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 639.6    Compiling idna v1.1.0
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 632.4    Compiling hashlink v0.10.0
#52 642.4    Compiling crossbeam-queue v0.3.12
#52 642.9    Compiling hmac v0.12.1
#52 643.4    Compiling rand_core v0.9.3
#52 644.6    Compiling either v1.15.0
#52 645.8    Compiling openssl-macros v0.1.1
#52 647.3    Compiling unicode-bidi v0.3.18
#52 650.1    Compiling unicode-properties v0.1.3
#52 650.9    Compiling unicode-xid v0.2.6
#52 651.2    Compiling adler2 v2.0.1
#52 651.6    Compiling native-tls v0.2.14
#52 652.0    Compiling uuid v1.18.0
#52 652.2    Compiling miniz_oxide v0.8.9
#52 653.5    Compiling sqlx-core v0.8.6
#52 657.4    Compiling derive_more-impl v2.0.1
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 668.3    Compiling rand_core v0.9.3
#48 669.3    Compiling block-buffer v0.10.4
#48 669.8    Compiling crypto-common v0.1.6
#48 670.3    Compiling ppv-lite86 v0.2.21
#48 672.7    Compiling openssl-macros v0.1.1
#48 674.2    Compiling base64 v0.21.7
#48 675.4    Compiling powerfmt v0.2.0
#48 676.8    Compiling time-core v0.1.5
#48 677.3    Compiling adler2 v2.0.1
#48 677.8    Compiling num-conv v0.1.0
#48 678.1    Compiling native-tls v0.2.14
#48 678.6    Compiling rustls v0.21.12
#48 678.7    Compiling unicode-xid v0.2.6
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 670.8    Compiling stringprep v0.1.5
#52 674.9    Compiling rand_chacha v0.9.0
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 682.3    Compiling bytestring v1.4.0
#48 682.3    Compiling derive_more-impl v2.0.1
#48 683.0    Compiling time-macros v0.2.23
#48 689.1    Compiling miniz_oxide v0.8.9
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 678.2    Compiling hkdf v0.12.4
#52 679.4    Compiling rand v0.8.5
#52 688.3    Compiling brotli-decompressor v5.0.0
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 697.2    Compiling deranged v0.5.2
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 701.9    Compiling actix-utils v3.0.1
#52 706.0    Compiling atoi v2.0.0
#52 706.4    Compiling md-5 v0.10.6
#52 706.8    Compiling bytestring v1.4.0
#52 707.5    Compiling actix-rt v2.10.0
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 710.6    Compiling rand_chacha v0.9.0
#48 714.5    Compiling digest v0.10.7
#48 716.6    Compiling url v2.5.7
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 713.1    Compiling actix-service v2.0.3
#52 715.9    Compiling cookie v0.16.2
#52 716.5    Compiling encoding_rs v0.8.35
#52 719.8    Compiling dotenvy v0.15.7
#52 722.2    Compiling openssl-probe v0.1.6
#52 723.2    Compiling home v0.5.11
#52 723.7    Compiling try-lock v0.2.5
#52 724.0    Compiling hex v0.4.3
#52 725.5    Compiling mime v0.3.17
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 734.2    Compiling pest_meta v2.8.1
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 729.2    Compiling regex-lite v0.1.7
#52 730.6    Compiling byteorder v1.5.0
#52 733.3    Compiling whoami v1.6.1
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 742.4    Compiling const-random v0.1.18
#48 742.5    Compiling brotli-decompressor v5.0.0
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 734.7    Compiling sqlx-postgres v0.8.6
#52 736.2    Compiling actix-router v0.5.3
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 760.2    Compiling actix-utils v3.0.1
#48 760.8    Compiling serde_urlencoded v0.7.1
#48 762.1    Compiling sct v0.7.1
#48 763.1    Compiling rustls-webpki v0.101.7
#48 771.2    Compiling actix-rt v2.11.0
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 754.9    Compiling want v0.3.1
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 773.5    Compiling actix-service v2.0.3
#48 776.5    Compiling cookie v0.16.2
#48 777.7    Compiling regex-lite v0.1.7
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 771.4    Compiling brotli v8.0.2
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 782.2    Compiling cpufeatures v0.2.17
#48 783.1    Compiling utf8parse v0.2.2
#48 783.4    Compiling mime v0.3.17
#48 786.3    Compiling openssl-probe v0.1.6
#48 791.0    Compiling anstyle-parse v0.2.7
#48 791.9    Compiling time v0.3.42
#48 795.2    Compiling sha1 v0.10.6
#48 797.4    Compiling actix-router v0.5.3
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 794.2    Compiling flate2 v1.1.2
#52 796.7    Compiling zstd v0.13.3
#52 798.0    Compiling rand v0.9.2
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 812.2    Compiling brotli v8.0.2
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 804.8    Compiling derive_more v2.0.1
#52 805.0    Compiling local-channel v0.1.5
#52 806.0    Compiling regex v1.11.2
#52 810.4    Compiling sha1 v0.10.6
#52 815.3    Compiling num-integer v0.1.46
#52 816.5    Compiling serde_urlencoded v0.7.1
#52 817.3    Compiling http-body v0.4.6
#52 817.6    Compiling actix-codec v0.5.2
#52 821.8    Compiling inout v0.1.4
#52 824.4    Compiling pin-project-internal v1.1.10
#52 824.8    Compiling language-tags v0.3.2
#52 830.9    Compiling tower-service v0.3.3
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 841.7    Compiling dlv-list v0.5.2
#48 843.0    Compiling pest_generator v2.8.1
#48 846.9    Compiling flate2 v1.1.2
#48 850.5    Compiling zstd v0.13.3
#48 852.4    Compiling rand v0.9.2
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 835.3    Compiling heck v0.5.0
#52 836.1    Compiling sqlx-macros-core v0.8.6
#52 846.7    Compiling hyper v0.14.32
#52 848.4    Compiling pin-project v1.1.10
#52 848.6    Compiling actix-http v3.11.1
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 856.6    Compiling derive_more v2.0.1
#48 856.9    Compiling local-channel v0.1.5
#48 857.3    Compiling regex v1.11.2
#48 865.2    Compiling actix-codec v0.5.2
#48 867.4    Compiling serde_spanned v0.6.9
#48 867.8    Compiling toml_datetime v0.6.11
#48 869.4    Compiling pin-project-internal v1.1.10
#48 873.4    Compiling num-traits v0.2.19
#48 875.7    Compiling language-tags v0.3.2
#48 876.9    Compiling winnow v0.7.13
#48 884.1    Compiling is_terminal_polyfill v1.70.1
#48 884.3    Compiling base64 v0.22.1
#48 887.2    Compiling anstyle-query v1.1.4
#48 887.5    Compiling foldhash v0.1.5
#48 890.0    Compiling anstyle v1.0.11
#48 891.4    Compiling thiserror v1.0.69
#48 892.3    Compiling toml_write v0.1.2
#48 893.4    Compiling colorchoice v1.0.4
#48 893.7    Compiling anstream v0.6.20
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 894.3    Compiling cipher v0.4.4
#52 895.8    Compiling num-bigint v0.4.6
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 905.6    Compiling toml_edit v0.22.27
#48 909.3    Compiling actix-http v3.11.1
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 905.2    Compiling tokio-native-tls v0.3.1
#52 905.9    Compiling actix-web-codegen v4.3.0
#52 910.3    Compiling actix-server v2.6.0
#52 911.5    Compiling futures-executor v0.3.31
#52 913.0    Compiling actix-macros v0.2.4
#52 919.2    Compiling impl-more v0.1.9
#52 919.4    Compiling base64 v0.21.7
#52 923.3    Compiling anyhow v1.0.99
#52 924.3    Compiling lazy_static v1.5.0
#52 924.5    Compiling sharded-slab v0.1.7
#52 934.1    Compiling rustls-pemfile v1.0.4
#52 936.0    Compiling actix-web v4.11.0
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 974.0    Compiling pin-project v1.1.10
#48 987.5    Compiling pest_derive v2.8.1
#48 989.0    Compiling ordered-multimap v0.7.3
#48 991.0    Compiling tokio-rustls v0.24.1
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 983.9    Compiling futures v0.3.31
#52 984.1    Compiling hyper-tls v0.5.0
#52 985.0    Compiling simple_asn1 v0.6.3
#52 989.1    Compiling blowfish v0.9.1
#52 989.7    Compiling tokio-retry v0.3.0
#52 990.3    Compiling sqlx-macros v0.8.6
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 1001.1    Compiling actix-web-codegen v4.3.0
#48 1004.3    Compiling tokio-native-tls v0.3.1
#48 1005.6    Compiling actix-server v2.6.0
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 999.2    Compiling matchers v0.2.0
#52 999.9    Compiling pem v3.0.5
#52 1003.3    Compiling combine v4.6.7
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 1009.7    Compiling hashlink v0.8.4
#48 1011.9    Compiling serde_with v3.14.0
#48 1026.3    Compiling serde_repr v0.1.20
#48 1028.4    Compiling thiserror-impl v1.0.69
#48 1034.6    Compiling actix-macros v0.2.4
#48 1036.5    Compiling unicode-segmentation v1.12.0
#48 1039.9    Compiling arraydeque v0.5.1
#48 1041.0    Compiling option-ext v0.2.0
#48 1041.1    Compiling impl-more v0.1.9
#48 1041.3    Compiling strsim v0.11.1
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 1033.6    Compiling tracing-log v0.2.0
#52 1034.8    Compiling async-trait v0.1.89
#52 1037.1    Compiling socket2 v0.4.10
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 1046.7    Compiling minimal-lexical v0.2.1
#48 1048.1    Compiling clap_lex v0.7.5
#48 1049.7    Compiling anyhow v1.0.99
#48 1050.8    Compiling lazy_static v1.5.0
#48 1051.0    Compiling hex v0.4.3
#48 1052.4    Compiling heck v0.5.0
#48 1053.5    Compiling clap_derive v4.5.45
#48 1054.5    Compiling hyperlocal v0.8.0
#48 1056.4    Compiling sharded-slab v0.1.7
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 1039.3    Compiling thread_local v1.1.9
#52 1039.6    Compiling sha1_smol v1.0.1
#52 1040.3    Compiling sync_wrapper v0.1.2
#52 1040.6    Compiling ipnet v2.11.0
#52 1040.6    Compiling arc-swap v1.7.1
#52 1041.9    Compiling nu-ansi-term v0.50.1
#52 1043.8    Compiling tracing-subscriber v0.3.20
#52 1044.2    Compiling reqwest v0.11.27
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 1060.9    Compiling clap_builder v4.5.46
#48 1063.4    Compiling nom v7.1.3
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 1063.1    Compiling redis v0.24.0
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 1074.2    Compiling actix-web v4.11.0
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 1099.7    Compiling jsonwebtoken v9.3.1
#52 1109.9    Compiling sqlx v0.8.6
#52 1110.0    Compiling bcrypt v0.15.1
#52 1110.9    Compiling actix-cors v0.7.1
#52 1114.7    Compiling viworks-admin-backend v0.1.0 (/app)
#52 ...
#48 [agent builder  6/10] RUN cargo build --release
#48 1130.2    Compiling dirs-sys v0.4.1
#48 ...
#52 [backend builder  7/11] RUN cargo build --release
#52 1123.6     Finished `release` profile [optimized] target(s) in 18m 42s
#52 1123.6 warning: the following packages contain code that will be rejected by a future version of Rust: redis v0.24.0
#52 1123.7 note: to see what the problems were, use the option `--future-incompat-report`, or run `cargo report future-incompatibilities --id 1`
#52 DONE 1124.2s
#71 [backend builder  8/11] RUN rm src/main.rs
#71 DONE 0.5s
#48 [agent builder  6/10] RUN cargo build --release
#48 ...
#72 [backend builder  9/11] COPY src ./src
#72 DONE 0.1s
#73 [backend builder 10/11] COPY migrations ./migrations
#73 DONE 0.0s
#48 [agent builder  6/10] RUN cargo build --release
#48 1132.8    Compiling yaml-rust2 v0.8.1
#48 ...
#74 [backend builder 11/11] RUN cargo build --release
#74 1.506     Finished `release` profile [optimized] target(s) in 1.01s
#74 1.507 warning: the following packages contain code that will be rejected by a future version of Rust: redis v0.24.0
#74 1.534 note: to see what the problems were, use the option `--future-incompat-report`, or run `cargo report future-incompatibilities --id 1`
#74 DONE 1.6s
#48 [agent builder  6/10] RUN cargo build --release
#48 ...
#75 [backend stage-1 4/7] COPY --from=builder /app/target/release/viworks-admin-backend /app/app
#75 DONE 0.0s
#76 [backend stage-1 5/7] COPY --from=builder /app/migrations /app/migrations
#76 DONE 0.0s
#77 [backend stage-1 6/7] COPY ops/entrypoint.sh /app/entrypoint.sh
#77 DONE 0.1s
#78 [backend stage-1 7/7] RUN adduser -D -u 10001 appuser &&     chown -R appuser:appuser /app &&     chmod +x /app/entrypoint.sh
#78 DONE 0.3s
#48 [agent builder  6/10] RUN cargo build --release
#48 ...
#79 [backend] exporting to image
#79 exporting layers 0.6s done
#79 writing image sha256:8888480f7640cc0bce6fc686cd0b4b0ea6b93e1ce3e73c4377e541bbcc8964d2 done
#79 naming to docker.io/library/digitaloceandocker-backend done
#79 DONE 0.6s
#80 [backend] resolving provenance for metadata file
#80 DONE 0.0s
#48 [agent builder  6/10] RUN cargo build --release
#48 1140.5    Compiling convert_case v0.6.0
#48 1143.6    Compiling bollard-stubs v1.43.0-rc.2
#48 1145.5    Compiling hyper-tls v0.5.0
#48 1145.9    Compiling hyper-rustls v0.24.2
#48 1146.4    Compiling rust-ini v0.20.0
#48 1149.9    Compiling json5 v0.4.1
#48 1158.6    Compiling toml v0.8.23
#48 1166.1    Compiling ron v0.8.1
#48 1166.3    Compiling rustls-pemfile v1.0.4
#48 1167.2    Compiling matchers v0.2.0
#48 1167.4    Compiling tracing-log v0.2.0
#48 1168.3    Compiling async-trait v0.1.89
#48 1170.3    Compiling thread_local v1.1.9
#48 1170.9    Compiling ipnet v2.11.0
#48 1172.4    Compiling iana-time-zone v0.1.63
#48 1173.5    Compiling match_cfg v0.1.0
#48 1173.6    Compiling nu-ansi-term v0.50.1
#48 1174.4    Compiling sync_wrapper v0.1.2
#48 1174.5    Compiling pathdiff v0.2.3
#48 1174.6    Compiling webpki-***s v0.25.4
#48 1174.8    Compiling reqwest v0.11.27
#48 1175.2    Compiling config v0.14.1
#48 1196.2    Compiling tracing-subscriber v0.3.20
#48 1214.3    Compiling hostname v0.3.1
#48 1214.6    Compiling chrono v0.4.41
#48 1224.2    Compiling bollard v0.15.0
#48 1246.0    Compiling dirs v5.0.1
#48 1246.3    Compiling actix-cors v0.7.1
#48 1250.3    Compiling clap v4.5.46
#48 1252.2    Compiling uuid v1.18.0
#48 1253.6    Compiling nix v0.27.1
#48 1254.5    Compiling sysinfo v0.37.0
#48 1284.2    Compiling viworks-gateway-agent v0.1.0 (/app)
#48 1284.4     Finished `release` profile [optimized] target(s) in 21m 23s
#48 DONE 1284.9s
#81 [agent builder  7/10] RUN rm src/main.rs
#81 DONE 0.3s
#82 [agent builder  8/10] COPY src/ ./src/
#82 DONE 0.1s
#83 [agent builder  9/10] RUN cargo build --release
#83 1.276     Finished `release` profile [optimized] target(s) in 0.85s
#83 DONE 1.4s
#84 [agent builder 10/10] RUN strip target/release/viworks-gateway-agent
#84 DONE 0.3s
#85 [agent stage-1 5/9] COPY --from=builder /app/target/release/viworks-gateway-agent /usr/local/bin/
#85 DONE 0.0s
#86 [agent stage-1 6/9] COPY agent.toml /etc/viworks/
#86 DONE 0.0s
#87 [agent stage-1 7/9] RUN chown -R viworks:viworks /etc/viworks /var/log/viworks
#87 DONE 0.2s
#88 [agent stage-1 8/9] RUN chmod +x /usr/local/bin/viworks-gateway-agent
#88 DONE 0.2s
#89 [agent stage-1 9/9] RUN chmod 644 /etc/viworks/agent.toml
#89 DONE 0.3s
#90 [agent] exporting to image
#90 exporting layers
#90 exporting layers 0.3s done
#90 writing image sha256:c72f3fb0a5146067e1440591134c67a46d7757775718b8a075a1596f8457d136 done
#90 naming to docker.io/library/digitaloceandocker-agent done
#90 DONE 0.3s
#91 [agent] resolving provenance for metadata file
#91 DONE 0.0s
 digitaloceandocker-backend  Built
 digitaloceandocker-frontend  Built
 digitaloceandocker-website  Built
 digitaloceandocker-agent  Built
 Container viworks-website  Creating
 Container viworks-redis  Creating
 Container viworks-agent  Creating
 Container viworks-nginx  Creating
 Container viworks-postgres  Creating
 Container viworks-redis  Created
 Container viworks-agent  Created
 Container viworks-nginx  Created
 Container viworks-postgres  Created
 Container viworks-backend  Creating
 Container viworks-website  Created
 Container viworks-backend  Created
 Container viworks-frontend  Creating
 Container viworks-frontend  Created
 Container viworks-redis  Starting
 Container viworks-website  Starting
 Container viworks-agent  Starting
 Container viworks-nginx  Starting
 Container viworks-postgres  Starting
 Container viworks-website  Started
 Container viworks-postgres  Started
 Container viworks-agent  Started
 Container viworks-redis  Started
 Container viworks-postgres  Waiting
 Container viworks-redis  Waiting
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
✅ backend is healthy
🔍 Checking frontend health...
✅ frontend is healthy
🔍 Checking nginx health...
⏳ Waiting for nginx to be healthy... (1/30)
✅ nginx is healthy
📊 Checking service status...
NAME               IMAGE                         COMMAND                  SERVICE    CREATED          STATUS                                     PORTS
viworks-agent      digitaloceandocker-agent      "/usr/local/bin/viwo…"   agent      24 seconds ago   Restarting (0) 7 seconds ago               
viworks-backend    digitaloceandocker-backend    "/usr/bin/dumb-init …"   backend    24 seconds ago   Restarting (0) 2 seconds ago               
viworks-frontend   digitaloceandocker-frontend   "dumb-init -- node s…"   frontend   24 seconds ago   Up 12 seconds (health: starting)           
viworks-nginx      nginx:alpine                  "/docker-entrypoint.…"   nginx      24 seconds ago   Up Less than a second (health: starting)   0.0.0.0:80->80/tcp, [::]:80->80/tcp, 0.0.0.0:443->443/tcp, [::]:443->443/tcp
viworks-postgres   postgres:15-alpine            "docker-entrypoint.s…"   postgres   24 seconds ago   Up 24 seconds (healthy)                    
viworks-redis      redis:7-alpine                "docker-entrypoint.s…"   redis      24 seconds ago   Up 24 seconds (healthy)                    
viworks-website    digitaloceandocker-website    "docker-entrypoint.s…"   website    24 seconds ago   Up 24 seconds (health: starting)           
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
Error response from daemon: Container db67df4d1869c86d762b3e4ce73e5eac3ecd652dcadcbf35f317c4b213322de8 is restarting, wait until the container is running
❌ Database connection failed
Testing Redis connection...
Error response from daemon: Container db67df4d1869c86d762b3e4ce73e5eac3ecd652dcadcbf35f317c4b213322de8 is restarting, wait until the container is running
❌ Redis connection failed
Testing backend API endpoints...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
curl: (7) Failed to connect to localhost port 8081 after 4 ms: Connection refused
❌ Backend health check failed
📊 Checking resource usage...
No viworks containers found
📋 Recent logs (last 20 lines each):
Backend logs:
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:150: ERROR:  relation "idx_users_email" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:151: ERROR:  relation "idx_users_status" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:152: ERROR:  relation "idx_sessions_user_id" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:153: ERROR:  relation "idx_sessions_status" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:154: ERROR:  relation "idx_sessions_expires_at" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:155: ERROR:  relation "idx_audit_events_user_id" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:156: ERROR:  relation "idx_audit_events_created_at" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:157: ERROR:  relation "idx_audit_events_event_type" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:158: ERROR:  relation "idx_desktop_devices_user_id" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:159: ERROR:  relation "idx_mobile_devices_user_id" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:160: ERROR:  relation "idx_otp_challenges_user_id" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:161: ERROR:  relation "idx_otp_challenges_expires_at" already exists
viworks-backend  | CREATE FUNCTION
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:173: ERROR:  trigger "update_users_updated_at" for relation "users" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:174: ERROR:  trigger "update_policies_updated_at" for relation "policies" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:184: ERROR:  duplicate key value violates unique constraint "users_username_key"
viworks-backend  | DETAIL:  Key (username)=(admin) already exists.
viworks-backend  | INSERT 0 1
viworks-backend  | 2025-09-01 23:46:53. | ✅ Database migrations completed
viworks-backend  | 2025-09-01 23:46:53. | 🚀 Launching app...
PostgreSQL logs:
viworks-postgres  | 2025-09-01 23:46:53.156 UTC [147] ERROR:  relation "idx_mobile_devices_user_id" already exists
viworks-postgres  | 2025-09-01 23:46:53.156 UTC [147] STATEMENT:  CREATE INDEX idx_mobile_devices_user_id ON mobile_devices(user_id);
viworks-postgres  | 2025-09-01 23:46:53.157 UTC [147] ERROR:  relation "idx_otp_challenges_user_id" already exists
viworks-postgres  | 2025-09-01 23:46:53.157 UTC [147] STATEMENT:  CREATE INDEX idx_otp_challenges_user_id ON otp_challenges(user_id);
viworks-postgres  | 2025-09-01 23:46:53.157 UTC [147] ERROR:  relation "idx_otp_challenges_expires_at" already exists
viworks-postgres  | 2025-09-01 23:46:53.157 UTC [147] STATEMENT:  CREATE INDEX idx_otp_challenges_expires_at ON otp_challenges(expires_at);
viworks-postgres  | 2025-09-01 23:46:53.163 UTC [147] ERROR:  trigger "update_users_updated_at" for relation "users" already exists
viworks-postgres  | 2025-09-01 23:46:53.163 UTC [147] STATEMENT:  CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
viworks-postgres  | 2025-09-01 23:46:53.164 UTC [147] ERROR:  trigger "update_policies_updated_at" for relation "policies" already exists
viworks-postgres  | 2025-09-01 23:46:53.164 UTC [147] STATEMENT:  CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
viworks-postgres  | 2025-09-01 23:46:53.167 UTC [147] ERROR:  duplicate key value violates unique constraint "users_username_key"
viworks-postgres  | 2025-09-01 23:46:53.167 UTC [147] DETAIL:  Key (username)=(admin) already exists.
viworks-postgres  | 2025-09-01 23:46:53.167 UTC [147] STATEMENT:  INSERT INTO users (username, email, password_hash, mobile, status, roles) VALUES (
viworks-postgres  | 	    'admin',
viworks-postgres  | 	    'admin@viworks.com',
viworks-postgres  | 	    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5u.Ge', -- admin123
viworks-postgres  | 	    '09123456789',
viworks-postgres  | 	    'active',
viworks-postgres  | 	    '["admin"]'
viworks-postgres  | 	);
Redis logs:
viworks-redis  | 1:C 01 Sep 2025 23:44:51.025 # WARNING Memory overcommit must be enabled! Without it, a background save or replication may fail under low memory condition. Being disabled, it can also cause failures without low memory condition, see https://github.com/jemalloc/jemalloc/issues/1328. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
viworks-redis  | 1:C 01 Sep 2025 23:44:51.025 * oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
viworks-redis  | 1:C 01 Sep 2025 23:44:51.025 * Redis version=7.4.5, bits=64, commit=00000000, modified=0, pid=1, just started
viworks-redis  | 1:C 01 Sep 2025 23:44:51.025 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
viworks-redis  | 1:M 01 Sep 2025 23:44:51.026 * monotonic clock: POSIX clock_gettime
viworks-redis  | 1:M 01 Sep 2025 23:44:51.028 * Running mode=standalone, port=6379.
viworks-redis  | 1:M 01 Sep 2025 23:44:51.029 * Server initialized
viworks-redis  | 1:M 01 Sep 2025 23:44:51.030 * Loading RDB produced by version 7.4.5
viworks-redis  | 1:M 01 Sep 2025 23:44:51.030 * RDB age 1640 seconds
viworks-redis  | 1:M 01 Sep 2025 23:44:51.030 * RDB memory usage when created 0.93 Mb
viworks-redis  | 1:M 01 Sep 2025 23:44:51.030 * Done loading RDB, keys loaded: 0, keys expired: 0.
viworks-redis  | 1:M 01 Sep 2025 23:44:51.030 * DB loaded from disk: 0.000 seconds
viworks-redis  | 1:M 01 Sep 2025 23:44:51.030 * Ready to accept connections tcp
✅ Deployment completed successfully!
📅 Deployment completed at: Mon Sep  1 23:47:48 UTC 2025
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
viworks-agent      digitaloceandocker-agent      "/usr/local/bin/viwo…"   agent      2 minutes ago   Restarting (0) 10 seconds ago   
viworks-backend    digitaloceandocker-backend    "/usr/bin/dumb-init …"   backend    2 minutes ago   Restarting (0) 54 seconds ago   
viworks-frontend   digitaloceandocker-frontend   "dumb-init -- node s…"   frontend   2 minutes ago   Up 2 minutes (unhealthy)        
viworks-nginx      nginx:alpine                  "/docker-entrypoint.…"   nginx      2 minutes ago   Restarting (1) 22 seconds ago   
viworks-postgres   postgres:15-alpine            "docker-entrypoint.s…"   postgres   2 minutes ago   Up 2 minutes (healthy)          
viworks-redis      redis:7-alpine                "docker-entrypoint.s…"   redis      2 minutes ago   Up 2 minutes (healthy)          
viworks-website    digitaloceandocker-website    "docker-entrypoint.s…"   website    2 minutes ago   Up 2 minutes (unhealthy)        
1m 1s
Run echo "🔍 Verifying deployment..."
🔍 Verifying deployment...
Testing frontend... 

