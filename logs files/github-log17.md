deploy
failed now in 39s

0s
2s
1s
2s
0s
31s
Run scp -i ~/.ssh/id_ed25519 deploy.sh ${DROPLET_USER}@${DROPLET_IP}:/tmp/
🚀 Starting ViWorks Automated Deployment...
📅 Deployment started at: Tue Sep  2 15:16:52 UTC 2025
🛑 Stopping all containers gracefully...
 Container viworks-nginx  Stopping
 Container viworks-nginx  Stopped
 Container viworks-nginx  Removing
 Container viworks-nginx  Removed
 Container viworks-frontend  Stopping
 Container viworks-website  Stopping
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
time="2025-09-02T15:16:53Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
🧹 Cleaning up Docker images...
Total reclaimed space: 0B
Deleted Images:
untagged: digitaloceandocker-frontend:latest
deleted: sha256:3433d6a717ac0bea5e019788e7735427aff300d81c07519034068b8f63927f7d
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
untagged: digitaloceandocker-website:latest
deleted: sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a
untagged: digitaloceandocker-backend:latest
deleted: sha256:64bc87401ebfd3246a6ef152df0bb48af39488794dd5292d916a71693dedf696

Total reclaimed space: 351MB
🧹 Cleaning up unused networks...
Deleted Networks:
viworks-public
viworks-internal

🔍 Verifying no conflicting containers exist...
🧹 Cleaning up and resetting git repository...
From https://github.com/apebrahimi/viworkdemo002
   723518d..2c2b47b  main       -> origin/main
HEAD is now at 2c2b47b fix: Resolve GitHub workflow YAML syntax and backend startup issues
🌐 Setting up two-network security architecture...
2a671e674cc6bed450370cda4fc875d7409729a661e0c268a63b0c1da8d122b4
c87f5af8700ed7f8a3c014c7ff3b516bcf299ef9716e86d68b9f0db315546458
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
 61a7421693bd Waiting 
 a612d38c9b48 Pulling fs layer 
 901a9540064a Pulling fs layer 
 6c13c55b4b82 Pulling fs layer 
 51a939567803 Waiting 
 a612d38c9b48 Waiting 
 901a9540064a Waiting 
 6c13c55b4b82 Waiting 
 0f940631c13f Pulling fs layer 
 a15854d6fd91 Pulling fs layer 
 0f940631c13f Waiting 
 685be96195b7 Pulling fs layer 
 a15854d6fd91 Waiting 
 ce414b3fa674 Pulling fs layer 
 6afcd9ec0fd9 Pulling fs layer 
 685be96195b7 Waiting 
 ce414b3fa674 Waiting 
 6afcd9ec0fd9 Waiting 
 403e3f251637 Downloading [==================================================>]     628B/628B
 403e3f251637 Verifying Checksum 
 403e3f251637 Download complete 
 9adfbae99cb7 Downloading [==================================================>]     955B/955B
 9adfbae99cb7 Download complete 
 6bc572a340ec Downloading [>                                                  ]  19.16kB/1.806MB
 6bc572a340ec Verifying Checksum 
 6bc572a340ec Download complete 
 6bc572a340ec Extracting [>                                                  ]  32.77kB/1.806MB
 6bc572a340ec Extracting [==================================================>]  1.806MB/1.806MB
 6bc572a340ec Pull complete 
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Extracting [==================================================>]     628B/628B
 c9ebe2ff2d2c Downloading [===========================================>       ]  1.049kB/1.209kB
 c9ebe2ff2d2c Downloading [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Verifying Checksum 
 c9ebe2ff2d2c Download complete 
 403e3f251637 Pull complete 
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Pull complete 
 7a8a46741e18 Downloading [==================================================>]     405B/405B
 7a8a46741e18 Verifying Checksum 
 7a8a46741e18 Download complete 
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 7a8a46741e18 Pull complete 
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 a992fbc61ecc Downloading [================================================>  ]  1.369kB/1.398kB
 a992fbc61ecc Downloading [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Verifying Checksum 
 a992fbc61ecc Download complete 
 c9ebe2ff2d2c Pull complete 
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Pull complete 
 cb1ff4086f82 Downloading [>                                                  ]    172kB/16.84MB
 0368fd46e3c6 Downloading [>                                                  ]  36.46kB/3.638MB
 cb1ff4086f82 Downloading [================>                                  ]  5.702MB/16.84MB
 0368fd46e3c6 Verifying Checksum 
 0368fd46e3c6 Download complete 
 0368fd46e3c6 Extracting [>                                                  ]  65.54kB/3.638MB
 4c55286bbede Downloading [==================================================>]     950B/950B
 4c55286bbede Verifying Checksum 
 4c55286bbede Download complete 
 cb1ff4086f82 Downloading [=============================>                     ]   9.97MB/16.84MB
 0368fd46e3c6 Extracting [==================>                                ]  1.376MB/3.638MB
 cb1ff4086f82 Downloading [===============================================>   ]  16.02MB/16.84MB
 0368fd46e3c6 Extracting [=============================================>     ]  3.342MB/3.638MB
 cb1ff4086f82 Verifying Checksum 
 cb1ff4086f82 Download complete 
 0368fd46e3c6 Extracting [==================================================>]  3.638MB/3.638MB
 cb1ff4086f82 Extracting [>                                                  ]  196.6kB/16.84MB
 0368fd46e3c6 Pull complete 
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Pull complete 
 cb1ff4086f82 Extracting [=>                                                 ]  589.8kB/16.84MB
 5e28347af205 Downloading [>                                                  ]  2.416kB/173.2kB
 5e28347af205 Verifying Checksum 
 5e28347af205 Download complete 
 5e28347af205 Extracting [=========>                                         ]  32.77kB/173.2kB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 cb1ff4086f82 Extracting [========>                                          ]  2.949MB/16.84MB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 311eca34042e Downloading [>                                                  ]  10.63kB/1.003MB
 311eca34042e Verifying Checksum 
 311eca34042e Download complete 
 cb1ff4086f82 Extracting [==============>                                    ]  4.719MB/16.84MB
 e6fe6f07e192 Downloading [>                                                  ]  127.1kB/12.41MB
 cb1ff4086f82 Extracting [=====================>                             ]  7.078MB/16.84MB
 e6fe6f07e192 Downloading [=============>                                     ]  3.453MB/12.41MB
 5e28347af205 Pull complete 
 311eca34042e Extracting [=>                                                 ]  32.77kB/1.003MB
 cb1ff4086f82 Extracting [=======================>                           ]  7.864MB/16.84MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 e6fe6f07e192 Downloading [===============================>                   ]  7.926MB/12.41MB
 311eca34042e Pull complete 
 cb1ff4086f82 Extracting [============================>                      ]  9.634MB/16.84MB
 a2cadbfeca72 Downloading [==================================================>]      99B/99B
 a2cadbfeca72 Download complete 
 e6fe6f07e192 Downloading [========================================>          ]  10.04MB/12.41MB
 4f4fb700ef54 Downloading [==================================================>]      32B/32B
 4f4fb700ef54 Verifying Checksum 
 4f4fb700ef54 Download complete 
 cb1ff4086f82 Extracting [===================================>               ]   11.8MB/16.84MB
 e6fe6f07e192 Downloading [=============================================>     ]  11.35MB/12.41MB
 cb1ff4086f82 Extracting [===========================================>       ]  14.75MB/16.84MB
 e6fe6f07e192 Verifying Checksum 
 e6fe6f07e192 Download complete 
 e6fe6f07e192 Extracting [>                                                  ]  131.1kB/12.41MB
 cb1ff4086f82 Extracting [=================================================> ]  16.52MB/16.84MB
 e6fe6f07e192 Extracting [====>                                              ]   1.18MB/12.41MB
 cb1ff4086f82 Extracting [==================================================>]  16.84MB/16.84MB
 e6fe6f07e192 Extracting [===========>                                       ]  2.884MB/12.41MB
 a976ed7e7808 Downloading [==================================================>]     574B/574B
 a976ed7e7808 Verifying Checksum 
 a976ed7e7808 Download complete 
 61a7421693bd Downloading [==================================================>]     969B/969B
 61a7421693bd Verifying Checksum 
 61a7421693bd Download complete 
 61a7421693bd Extracting [==================================================>]     969B/969B
 61a7421693bd Extracting [==================================================>]     969B/969B
 cb1ff4086f82 Pull complete 
 e6fe6f07e192 Extracting [===================>                               ]  4.719MB/12.41MB
 61a7421693bd Pull complete 
 nginx Pulled 
 e6fe6f07e192 Extracting [============================>                      ]  7.078MB/12.41MB
 51a939567803 Downloading [>                                                  ]     12kB/1.116MB
 51a939567803 Verifying Checksum 
 51a939567803 Download complete 
 51a939567803 Extracting [=>                                                 ]  32.77kB/1.116MB
 51a939567803 Extracting [==================================================>]  1.116MB/1.116MB
 e6fe6f07e192 Extracting [===================================>               ]  8.782MB/12.41MB
 51a939567803 Pull complete 
 e6fe6f07e192 Extracting [===============================================>   ]   11.8MB/12.41MB
 a612d38c9b48 Downloading [==================================================>]     175B/175B
 a612d38c9b48 Verifying Checksum 
 a612d38c9b48 Download complete 
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 e6fe6f07e192 Extracting [==================================================>]  12.41MB/12.41MB
 a612d38c9b48 Pull complete 
 e6fe6f07e192 Pull complete 
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 a2cadbfeca72 Pull complete 
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Pull complete 
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 901a9540064a Downloading [==================================================>]     116B/116B
 901a9540064a Verifying Checksum 
 901a9540064a Download complete 
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Extracting [==================================================>]     116B/116B
 a976ed7e7808 Pull complete 
 901a9540064a Pull complete 
 redis Pulled 
 6c13c55b4b82 Downloading [>                                                  ]  532.5kB/103.9MB
 6c13c55b4b82 Downloading [===>                                               ]  6.386MB/103.9MB
 0f940631c13f Downloading [=======>                                           ]  1.369kB/9.448kB
 0f940631c13f Downloading [==================================================>]  9.448kB/9.448kB
 0f940631c13f Verifying Checksum 
 0f940631c13f Download complete 
 6c13c55b4b82 Downloading [=====>                                             ]  11.18MB/103.9MB
 6c13c55b4b82 Downloading [========>                                          ]  17.58MB/103.9MB
 a15854d6fd91 Downloading [==================================================>]     129B/129B
 a15854d6fd91 Verifying Checksum 
 a15854d6fd91 Download complete 
 6c13c55b4b82 Downloading [============>                                      ]  25.03MB/103.9MB
 6c13c55b4b82 Downloading [==============>                                    ]  29.33MB/103.9MB
 685be96195b7 Download complete 
 6c13c55b4b82 Downloading [================>                                  ]  34.14MB/103.9MB
 6c13c55b4b82 Downloading [================>                                  ]  35.21MB/103.9MB
 6c13c55b4b82 Downloading [===================>                               ]  40.52MB/103.9MB
 ce414b3fa674 Downloading [===========>                                       ]  1.369kB/5.927kB
 ce414b3fa674 Downloading [==================================================>]  5.927kB/5.927kB
 ce414b3fa674 Verifying Checksum 
 ce414b3fa674 Download complete 
 6c13c55b4b82 Downloading [====================>                              ]  42.14MB/103.9MB
 6afcd9ec0fd9 Downloading [==================================================>]     185B/185B
 6afcd9ec0fd9 Verifying Checksum 
 6afcd9ec0fd9 Download complete 
 6c13c55b4b82 Downloading [=====================>                             ]  44.81MB/103.9MB
 6c13c55b4b82 Downloading [========================>                          ]  50.15MB/103.9MB
 6c13c55b4b82 Downloading [==========================>                        ]  56.02MB/103.9MB
 6c13c55b4b82 Downloading [=============================>                     ]  60.83MB/103.9MB
 6c13c55b4b82 Downloading [==============================>                    ]  62.46MB/103.9MB
 6c13c55b4b82 Downloading [===============================>                   ]  66.19MB/103.9MB
 6c13c55b4b82 Downloading [==================================>                ]     71MB/103.9MB
 6c13c55b4b82 Downloading [====================================>              ]  75.24MB/103.9MB
 6c13c55b4b82 Downloading [======================================>            ]  80.05MB/103.9MB
 6c13c55b4b82 Downloading [========================================>          ]  83.25MB/103.9MB
 6c13c55b4b82 Downloading [===========================================>       ]  90.18MB/103.9MB
 6c13c55b4b82 Downloading [============================================>      ]  91.78MB/103.9MB
 6c13c55b4b82 Downloading [==============================================>    ]  97.68MB/103.9MB
 6c13c55b4b82 Downloading [=================================================> ]  102.5MB/103.9MB
 6c13c55b4b82 Verifying Checksum 
 6c13c55b4b82 Download complete 
 6c13c55b4b82 Extracting [>                                                  ]  557.1kB/103.9MB
 6c13c55b4b82 Extracting [=>                                                 ]  2.228MB/103.9MB
 6c13c55b4b82 Extracting [==>                                                ]  5.014MB/103.9MB
 6c13c55b4b82 Extracting [====>                                              ]  8.356MB/103.9MB
 6c13c55b4b82 Extracting [=====>                                             ]  11.14MB/103.9MB
 6c13c55b4b82 Extracting [=======>                                           ]  15.04MB/103.9MB
 6c13c55b4b82 Extracting [=========>                                         ]  18.94MB/103.9MB
 6c13c55b4b82 Extracting [==========>                                        ]  21.73MB/103.9MB
 6c13c55b4b82 Extracting [============>                                      ]  25.07MB/103.9MB
 6c13c55b4b82 Extracting [=============>                                     ]   27.3MB/103.9MB
 6c13c55b4b82 Extracting [==============>                                    ]  29.52MB/103.9MB
 6c13c55b4b82 Extracting [===============>                                   ]  32.31MB/103.9MB
 6c13c55b4b82 Extracting [================>                                  ]  35.09MB/103.9MB
 6c13c55b4b82 Extracting [==================>                                ]  37.88MB/103.9MB
 6c13c55b4b82 Extracting [===================>                               ]  41.22MB/103.9MB
 6c13c55b4b82 Extracting [=====================>                             ]  44.01MB/103.9MB
 6c13c55b4b82 Extracting [======================>                            ]  47.35MB/103.9MB
 6c13c55b4b82 Extracting [=======================>                           ]  49.58MB/103.9MB
 6c13c55b4b82 Extracting [========================>                          ]  51.25MB/103.9MB
 6c13c55b4b82 Extracting [=========================>                         ]  52.92MB/103.9MB
 6c13c55b4b82 Extracting [==========================>                        ]  55.15MB/103.9MB
 6c13c55b4b82 Extracting [===========================>                       ]  57.38MB/103.9MB
 6c13c55b4b82 Extracting [============================>                      ]  60.16MB/103.9MB
 6c13c55b4b82 Extracting [=============================>                     ]  61.83MB/103.9MB
 6c13c55b4b82 Extracting [===============================>                   ]  64.62MB/103.9MB
 6c13c55b4b82 Extracting [================================>                  ]  67.96MB/103.9MB
 6c13c55b4b82 Extracting [==================================>                ]   71.3MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.09MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.65MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]   75.2MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]  76.87MB/103.9MB
 6c13c55b4b82 Extracting [=====================================>             ]  78.54MB/103.9MB
 6c13c55b4b82 Extracting [======================================>            ]  80.77MB/103.9MB
 6c13c55b4b82 Extracting [=======================================>           ]  81.89MB/103.9MB
 6c13c55b4b82 Extracting [========================================>          ]  84.12MB/103.9MB
 6c13c55b4b82 Extracting [=========================================>         ]  86.34MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]  89.69MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]   90.8MB/103.9MB
 6c13c55b4b82 Extracting [=============================================>     ]  93.59MB/103.9MB
 6c13c55b4b82 Extracting [==============================================>    ]  95.81MB/103.9MB
 6c13c55b4b82 Extracting [===============================================>   ]  99.16MB/103.9MB
 6c13c55b4b82 Extracting [================================================>  ]  101.4MB/103.9MB
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

#2 [backend internal] load build definition from Dockerfile.fixed
#2 transferring dockerfile: 1.87kB done
#2 WARN: FromAsCasing: 'as' and 'FROM' keywords' casing do not match (line 2)
#2 DONE 0.0s

#3 [website internal] load build definition from Dockerfile
#3 transferring dockerfile: 2.04kB done
#3 DONE 0.0s

#4 [frontend internal] load build definition from Dockerfile
#4 transferring dockerfile: 1.58kB done
#4 DONE 0.0s

#5 [frontend internal] load metadata for docker.io/library/node:22-alpine
#5 DONE 0.6s

#6 [website internal] load metadata for docker.io/library/node:18-alpine
#6 DONE 0.6s

#7 [frontend internal] load .dockerignore
#7 transferring context: 2B done
#7 DONE 0.0s

#8 [frontend builder 1/7] FROM docker.io/library/node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9
#8 DONE 0.0s

#9 [website internal] load .dockerignore
#9 transferring context: 2B done
#9 DONE 0.0s

#10 [frontend internal] load build context
#10 transferring context: 5.93kB 0.0s done
#10 DONE 0.0s

#11 [website base 1/1] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#11 DONE 0.0s

#12 [frontend builder 4/7] COPY package*.json ./
#12 CACHED

#13 [frontend builder 6/7] COPY . .
#13 CACHED

#14 [frontend builder 2/7] WORKDIR /app
#14 CACHED

#15 [frontend builder 7/7] RUN echo "Starting build process..." &&     npm run build &&     echo "Build completed. Checking standalone output..." &&     ls -la .next/ &&     ls -la .next/standalone/ || echo "Standalone directory not found!" &&     echo "Build verification complete."
#15 CACHED

#16 [frontend builder 5/7] RUN npm install
#16 CACHED

#17 [frontend runner 2/7] RUN apk add --no-cache dumb-init
#17 CACHED

#18 [frontend builder 3/7] RUN apk add --no-cache python3 make g++
#18 CACHED

#19 [frontend runner 4/7] WORKDIR /app
#19 CACHED

#20 [frontend runner 6/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#20 CACHED

#21 [frontend runner 3/7] RUN addgroup -g 1001 -S nodejs &&     adduser -u 1001 -S nextjs -G nodejs
#21 CACHED

#22 [frontend runner 5/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#22 CACHED

#23 [frontend runner 7/7] RUN mkdir -p ./public
#23 CACHED

#24 [website internal] load build context
#24 transferring context: 7.37kB 0.0s done
#24 DONE 0.0s

#25 [website builder 4/5] RUN mkdir -p public
#25 CACHED

#26 [website runner 6/8] RUN chown nextjs:nodejs .next
#26 CACHED

#27 [website builder 5/5] RUN npm run build
#27 CACHED

#28 [website builder 3/5] COPY . .
#28 CACHED

#29 [website deps 2/4] WORKDIR /app
#29 CACHED

#30 [website runner 7/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#30 CACHED

#31 [website deps 1/4] RUN apk add --no-cache libc6-compat
#31 CACHED

#32 [website runner 5/8] RUN mkdir .next
#32 CACHED

#33 [website runner 3/8] RUN adduser --system --uid 1001 nextjs
#33 CACHED

#34 [website builder 1/5] WORKDIR /app
#34 CACHED

#35 [website runner 4/8] COPY --from=builder /app/public ./public
#35 CACHED

#36 [website builder 2/5] COPY --from=deps /app/node_modules ./node_modules
#36 CACHED

#37 [website deps 3/4] COPY package.json pnpm-lock.yaml* ./
#37 CACHED

#38 [website runner 2/8] RUN addgroup --system --gid 1001 nodejs
#38 CACHED

#39 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#39 CACHED

#40 [website runner 8/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#40 CACHED

#41 [frontend] exporting to image
#41 exporting layers done
#41 writing image sha256:3433d6a717ac0bea5e019788e7735427aff300d81c07519034068b8f63927f7d done
#41 naming to docker.io/library/digitaloceandocker-frontend 0.0s done
#41 DONE 0.0s

#42 [backend internal] load metadata for docker.io/library/rust:1.89.0-alpine
#42 DONE 0.7s

#43 [backend internal] load metadata for docker.io/library/alpine:3.22
#43 DONE 0.7s

#44 [backend internal] load .dockerignore
#44 transferring context: 2B done
#44 DONE 0.0s

#45 [backend builder  1/11] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#45 DONE 0.0s

#46 [backend stage-1 1/7] FROM docker.io/library/alpine:3.22@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#46 DONE 0.0s

#47 [website] exporting to image
#47 exporting layers done
#47 writing image sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a done
#47 naming to docker.io/library/digitaloceandocker-website done
#47 DONE 0.0s

#48 [backend internal] load build context
#48 transferring context: 5.13kB done
#48 DONE 0.0s

#49 [backend builder  7/11] RUN cargo build --release
#49 CACHED

#50 [backend builder  4/11] RUN rustup target add x86_64-unknown-linux-musl
#50 CACHED

#51 [backend builder  3/11] RUN apk add --no-cache     pkgconfig     openssl-dev     postgresql-dev     musl-dev     gcc     curl
#51 CACHED

#52 [backend builder  2/11] WORKDIR /app
#52 CACHED

#53 [backend builder  6/11] RUN mkdir src && echo "fn main() {}" > src/main.rs
#53 CACHED

#54 [backend builder  5/11] COPY Cargo.toml Cargo.lock* ./
#54 CACHED

#55 [backend builder  8/11] RUN rm src/main.rs
#55 CACHED

#56 [frontend] resolving provenance for metadata file
#56 DONE 0.0s

#57 [website] resolving provenance for metadata file
#57 DONE 0.0s

#58 [backend builder  9/11] COPY src ./src
#58 DONE 0.6s

#59 [backend builder 10/11] COPY migrations ./migrations
#59 DONE 0.1s

#60 [backend builder 11/11] RUN cargo build --release
#60 1.003     Finished `release` profile [optimized] target(s) in 0.60s
#60 1.004 warning: the following packages contain code that will be rejected by a future version of Rust: redis v0.24.0
#60 1.020 note: to see what the problems were, use the option `--future-incompat-report`, or run `cargo report future-incompatibilities --id 1`
#60 DONE 1.1s

#61 [backend stage-1 3/7] WORKDIR /app
#61 CACHED

#62 [backend stage-1 5/7] COPY --from=builder /app/migrations /app/migrations
#62 CACHED

#63 [backend stage-1 2/7] RUN apk add --no-cache     ca-certificates     dumb-init     busybox-extras     netcat-openbsd     wget     curl     tzdata     bash     postgresql-client     redis
#63 CACHED

#64 [backend stage-1 4/7] COPY --from=builder /app/target/release/viworks-admin-backend /app/app
#64 CACHED

#65 [backend stage-1 6/7] COPY ops/entrypoint.sh /app/entrypoint.sh
#65 CACHED

#66 [backend stage-1 7/7] RUN adduser -D -u 10001 appuser &&     chown -R appuser:appuser /app &&     chmod +x /app/entrypoint.sh
#66 CACHED
 digitaloceandocker-backend  Built
 digitaloceandocker-frontend  Built
 digitaloceandocker-website  Built

#67 [backend] exporting to image
#67 exporting layers done
#67 writing image sha256:64bc87401ebfd3246a6ef152df0bb48af39488794dd5292d916a71693dedf696 done
#67 naming to docker.io/library/digitaloceandocker-backend 0.0s done
#67 DONE 0.0s

#68 [backend] resolving provenance for metadata file
#68 DONE 0.0s
 Container viworks-redis  Creating
 Container viworks-website  Creating
 Container viworks-postgres  Creating
 Container viworks-postgres  Created
 Container viworks-website  Created
 Container viworks-redis  Created
 Container viworks-backend  Creating
 Container viworks-backend  Created
 Container viworks-frontend  Creating
 Container viworks-frontend  Created
 Container viworks-nginx  Creating
 Container viworks-nginx  Created
 Container viworks-postgres  Starting
 Container viworks-redis  Starting
 Container viworks-website  Starting
 Container viworks-redis  Started
 Container viworks-website  Started
 Container viworks-postgres  Started
 Container viworks-redis  Waiting
 Container viworks-postgres  Waiting
 Container viworks-redis  Healthy
 Container viworks-postgres  Healthy
 Container viworks-backend  Starting
 Container viworks-backend  Started
 Container viworks-backend  Waiting
 Container viworks-backend  Error
dependency failed to start: container viworks-backend is unhealthy
Error: Process completed with exit code 1.
0s
0s
0s



and 


.github/workflows/deploy-sequential.yml
 
fix: Resolve GitHub workflow YAML syntax and backend startup issues #36
Jobs
Run details
Triggered via push 1 minute ago
@apebrahimiapebrahimi
pushed
 2c2b47b
main
Status
Failure
Total duration
–
Artifacts
–
This workflow graph cannot be shown
A graph will be generated the next time this workflow is run.

Annotations
1 error
Invalid workflow file: .github/workflows/deploy-sequential.yml#L45
You have an error in your yaml syntax on line 45
