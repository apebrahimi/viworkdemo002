deploy
failed 1 minute ago in 10m 27s

0s
1s
2s
1s
0s
10m 20s
Run scp -i ~/.ssh/id_ed25519 deploy.sh ${DROPLET_USER}@${DROPLET_IP}:/tmp/
🚀 Starting ViWorks Automated Deployment...
📅 Deployment started at: Tue Sep  2 14:36:30 UTC 2025
🛑 Stopping all containers gracefully...
 Container viworks-nginx  Stopping
 Container viworks-nginx  Stopped
 Container viworks-nginx  Removing
 Container viworks-nginx  Removed
 Container viworks-website  Stopping
 Container viworks-frontend  Stopping
 Container viworks-frontend  Stopped
 Container viworks-frontend  Removing
 Container viworks-frontend  Removed
 Container viworks-backend  Stopping
 Container viworks-website  Stopped
 Container viworks-website  Removing
 Container viworks-website  Removed
 Container viworks-backend  Stopped
 Container viworks-backend  Removing
 Container viworks-backend  Removed
 Container viworks-postgres  Stopping
 Container viworks-redis  Stopping
 Container viworks-redis  Stopped
 Container viworks-redis  Removing
 Container viworks-redis  Removed
 Container viworks-postgres  Stopped
 Container viworks-postgres  Removing
 Container viworks-postgres  Removed
🛑 Force stopping any running containers...
🧹 Removing containers with specific names...
🧹 Removing orphaned containers...
time="2025-09-02T14:36:31Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
🧹 Cleaning up Docker images...
Total reclaimed space: 0B
Deleted Images:
untagged: digitaloceandocker-backend:latest
deleted: sha256:e48fbc3b657cba6cae4eee23d960496857b0e131ee3680c6ed9147c51094554c
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
deleted: sha256:6f57e989248e612e031f00596c76c5553010fd2163a93ef2ddcc45cea1ff1a65
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
Total reclaimed space: 351MB
🧹 Cleaning up unused networks...
Deleted Networks:
viworks-public
viworks-internal
🔍 Verifying no conflicting containers exist...
🧹 Cleaning up and resetting git repository...
From https://github.com/apebrahimi/viworkdemo002
   dfaeaac..31e2352  main       -> origin/main
HEAD is now at 31e2352 feat(auth): Implement admin/user authentication separation
🌐 Setting up two-network security architecture...
3a23e0ba173d36bd601cd89b1f014c5949cf7852d2a1f5c65785e47ffd3ecd51
fe1b4666ffca4da6247960d5fc825d5eeed0dc6c0b372ae653ee0e4077a088cc
🔨 Building and starting new containers with two-network security...
 redis Pulling 
 postgres Pulling 
 nginx Pulling 
 9824c27679d3 Already exists 
 0368fd46e3c6 Pulling fs layer 
 6bc572a340ec Pulling fs layer 
 403e3f251637 Pulling fs layer 
 9adfbae99cb7 Pulling fs layer 
 4c55286bbede Pulling fs layer 
 5e28347af205 Pulling fs layer 
 311eca34042e Pulling fs layer 
 e6fe6f07e192 Pulling fs layer 
 0368fd46e3c6 Waiting 
 a2cadbfeca72 Pulling fs layer 
 4f4fb700ef54 Pulling fs layer 
 a976ed7e7808 Pulling fs layer 
 311eca34042e Waiting 
 e6fe6f07e192 Waiting 
 a2cadbfeca72 Waiting 
 4f4fb700ef54 Waiting 
 a976ed7e7808 Waiting 
 4c55286bbede Waiting 
 5e28347af205 Waiting 
 7a8a46741e18 Pulling fs layer 
 c9ebe2ff2d2c Pulling fs layer 
 a992fbc61ecc Pulling fs layer 
 cb1ff4086f82 Pulling fs layer 
 7a8a46741e18 Waiting 
 c9ebe2ff2d2c Waiting 
 a992fbc61ecc Waiting 
 cb1ff4086f82 Waiting 
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
 6bc572a340ec Downloading [>                                                  ]  18.84kB/1.806MB
 6bc572a340ec Verifying Checksum 
 6bc572a340ec Download complete 
 6bc572a340ec Extracting [>                                                  ]  32.77kB/1.806MB
 9adfbae99cb7 Downloading [==================================================>]     955B/955B
 403e3f251637 Downloading [==================================================>]     628B/628B
 9adfbae99cb7 Verifying Checksum 
 9adfbae99cb7 Download complete 
 403e3f251637 Verifying Checksum 
 403e3f251637 Download complete 
 6bc572a340ec Extracting [==================================================>]  1.806MB/1.806MB
 6bc572a340ec Pull complete 
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Pull complete 
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Pull complete 
 a992fbc61ecc Downloading [=====================================>             ]  1.049kB/1.398kB
 a992fbc61ecc Downloading [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Verifying Checksum 
 a992fbc61ecc Download complete 
 c9ebe2ff2d2c Downloading [===========================================>       ]  1.049kB/1.209kB
 c9ebe2ff2d2c Download complete 
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
 cb1ff4086f82 Downloading [>                                                  ]  171.9kB/16.84MB
 4c55286bbede Downloading [==================================================>]     950B/950B
 4c55286bbede Verifying Checksum 
 4c55286bbede Download complete 
 0368fd46e3c6 Downloading [>                                                  ]  36.88kB/3.638MB
 0368fd46e3c6 Verifying Checksum 
 0368fd46e3c6 Download complete 
 0368fd46e3c6 Extracting [>                                                  ]  65.54kB/3.638MB
 cb1ff4086f82 Downloading [========================>                          ]  8.114MB/16.84MB
 0368fd46e3c6 Extracting [==================>                                ]  1.376MB/3.638MB
 cb1ff4086f82 Downloading [===============================================>   ]  15.96MB/16.84MB
 cb1ff4086f82 Verifying Checksum 
 cb1ff4086f82 Download complete 
 cb1ff4086f82 Extracting [>                                                  ]  196.6kB/16.84MB
 0368fd46e3c6 Extracting [=================================================> ]  3.604MB/3.638MB
 0368fd46e3c6 Extracting [==================================================>]  3.638MB/3.638MB
 0368fd46e3c6 Pull complete 
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Pull complete 
 cb1ff4086f82 Extracting [=>                                                 ]  589.8kB/16.84MB
 5e28347af205 Downloading [>                                                  ]  2.738kB/173.2kB
 5e28347af205 Verifying Checksum 
 5e28347af205 Download complete 
 5e28347af205 Extracting [=========>                                         ]  32.77kB/173.2kB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 cb1ff4086f82 Extracting [===========>                                       ]  3.932MB/16.84MB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 311eca34042e Downloading [>                                                  ]  10.95kB/1.003MB
 311eca34042e Verifying Checksum 
 311eca34042e Download complete 
 cb1ff4086f82 Extracting [=================>                                 ]  5.898MB/16.84MB
 e6fe6f07e192 Downloading [>                                                  ]  127.5kB/12.41MB
 cb1ff4086f82 Extracting [=====================>                             ]  7.274MB/16.84MB
 5e28347af205 Pull complete 
 311eca34042e Extracting [=>                                                 ]  32.77kB/1.003MB
 e6fe6f07e192 Downloading [=====================>                             ]  5.243MB/12.41MB
 311eca34042e Extracting [=================================================> ]    983kB/1.003MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 cb1ff4086f82 Extracting [=========================>                         ]  8.651MB/16.84MB
 e6fe6f07e192 Downloading [==================================>                ]  8.638MB/12.41MB
 311eca34042e Pull complete 
 a2cadbfeca72 Downloading [==================================================>]      99B/99B
 a2cadbfeca72 Verifying Checksum 
 a2cadbfeca72 Download complete 
 e6fe6f07e192 Verifying Checksum 
 e6fe6f07e192 Download complete 
 e6fe6f07e192 Extracting [>                                                  ]  131.1kB/12.41MB
 cb1ff4086f82 Extracting [==============================>                    ]  10.42MB/16.84MB
 4f4fb700ef54 Downloading [==================================================>]      32B/32B
 4f4fb700ef54 Verifying Checksum 
 4f4fb700ef54 Download complete 
 e6fe6f07e192 Extracting [======>                                            ]  1.704MB/12.41MB
 cb1ff4086f82 Extracting [===================================>               ]  11.99MB/16.84MB
 e6fe6f07e192 Extracting [=============>                                     ]  3.277MB/12.41MB
 cb1ff4086f82 Extracting [=========================================>         ]  13.96MB/16.84MB
 e6fe6f07e192 Extracting [====================>                              ]  4.981MB/12.41MB
 cb1ff4086f82 Extracting [==============================================>    ]  15.53MB/16.84MB
 a976ed7e7808 Downloading [==================================================>]     574B/574B
 a976ed7e7808 Verifying Checksum 
 a976ed7e7808 Download complete 
 e6fe6f07e192 Extracting [===========================>                       ]  6.947MB/12.41MB
 61a7421693bd Downloading [==================================================>]     969B/969B
 61a7421693bd Verifying Checksum 
 61a7421693bd Download complete 
 61a7421693bd Extracting [==================================================>]     969B/969B
 61a7421693bd Extracting [==================================================>]     969B/969B
 e6fe6f07e192 Extracting [===================================>               ]  8.782MB/12.41MB
 51a939567803 Downloading [>                                                  ]     12kB/1.116MB
 cb1ff4086f82 Extracting [==================================================>]  16.84MB/16.84MB
 61a7421693bd Pull complete 
 51a939567803 Verifying Checksum 
 51a939567803 Download complete 
 51a939567803 Extracting [=>                                                 ]  32.77kB/1.116MB
 e6fe6f07e192 Extracting [=========================================>         ]  10.22MB/12.41MB
 51a939567803 Extracting [==================================================>]  1.116MB/1.116MB
 51a939567803 Pull complete 
 e6fe6f07e192 Extracting [==============================================>    ]  11.53MB/12.41MB
 e6fe6f07e192 Extracting [==================================================>]  12.41MB/12.41MB
 cb1ff4086f82 Pull complete 
 e6fe6f07e192 Pull complete 
 nginx Pulled 
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 a2cadbfeca72 Pull complete 
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 a612d38c9b48 Downloading [==================================================>]     175B/175B
 a612d38c9b48 Verifying Checksum 
 a612d38c9b48 Download complete 
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 4f4fb700ef54 Pull complete 
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 a612d38c9b48 Pull complete 
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 a976ed7e7808 Pull complete 
 901a9540064a Downloading [==================================================>]     116B/116B
 901a9540064a Verifying Checksum 
 901a9540064a Download complete 
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Extracting [==================================================>]     116B/116B
 redis Pulled 
 901a9540064a Pull complete 
 6c13c55b4b82 Downloading [>                                                  ]  540.7kB/103.9MB
 6c13c55b4b82 Downloading [====>                                              ]  8.581MB/103.9MB
 6c13c55b4b82 Downloading [======>                                            ]  12.88MB/103.9MB
 0f940631c13f Downloading [=====>                                             ]  1.049kB/9.448kB
 0f940631c13f Downloading [==================================================>]  9.448kB/9.448kB
 0f940631c13f Verifying Checksum 
 0f940631c13f Download complete 
 6c13c55b4b82 Downloading [========>                                          ]  18.23MB/103.9MB
 6c13c55b4b82 Downloading [===========>                                       ]  23.56MB/103.9MB
 a15854d6fd91 Downloading [==================================================>]     129B/129B
 a15854d6fd91 Verifying Checksum 
 a15854d6fd91 Download complete 
 6c13c55b4b82 Downloading [==============>                                    ]  31.04MB/103.9MB
 6c13c55b4b82 Downloading [==================>                                ]  37.97MB/103.9MB
 685be96195b7 Downloading [==================================================>]     171B/171B
 685be96195b7 Verifying Checksum 
 685be96195b7 Download complete 
 6c13c55b4b82 Downloading [======================>                            ]  46.49MB/103.9MB
 6c13c55b4b82 Downloading [=========================>                         ]  53.97MB/103.9MB
 ce414b3fa674 Downloading [========>                                          ]  1.049kB/5.927kB
 ce414b3fa674 Downloading [==================================================>]  5.927kB/5.927kB
 ce414b3fa674 Verifying Checksum 
 ce414b3fa674 Download complete 
 6c13c55b4b82 Downloading [=============================>                     ]  61.43MB/103.9MB
 6c13c55b4b82 Downloading [=================================>                 ]  68.88MB/103.9MB
 6afcd9ec0fd9 Downloading [==================================================>]     185B/185B
 6afcd9ec0fd9 Verifying Checksum 
 6afcd9ec0fd9 Download complete 
 6c13c55b4b82 Downloading [===================================>               ]  74.74MB/103.9MB
 6c13c55b4b82 Downloading [=======================================>           ]  81.72MB/103.9MB
 6c13c55b4b82 Downloading [==========================================>        ]  88.13MB/103.9MB
 6c13c55b4b82 Downloading [===========================================>       ]  89.75MB/103.9MB
 6c13c55b4b82 Downloading [==============================================>    ]  97.21MB/103.9MB
 6c13c55b4b82 Downloading [================================================>  ]  101.5MB/103.9MB
 6c13c55b4b82 Verifying Checksum 
 6c13c55b4b82 Download complete 
 6c13c55b4b82 Extracting [>                                                  ]  557.1kB/103.9MB
 6c13c55b4b82 Extracting [=>                                                 ]  2.785MB/103.9MB
 6c13c55b4b82 Extracting [==>                                                ]  5.571MB/103.9MB
 6c13c55b4b82 Extracting [====>                                              ]  8.356MB/103.9MB
 6c13c55b4b82 Extracting [=====>                                             ]   11.7MB/103.9MB
 6c13c55b4b82 Extracting [=======>                                           ]  15.04MB/103.9MB
 6c13c55b4b82 Extracting [=========>                                         ]  18.94MB/103.9MB
 6c13c55b4b82 Extracting [===========>                                       ]   23.4MB/103.9MB
 6c13c55b4b82 Extracting [============>                                      ]  26.74MB/103.9MB
 6c13c55b4b82 Extracting [==============>                                    ]  30.08MB/103.9MB
 6c13c55b4b82 Extracting [================>                                  ]  33.42MB/103.9MB
 6c13c55b4b82 Extracting [=================>                                 ]  36.77MB/103.9MB
 6c13c55b4b82 Extracting [===================>                               ]  40.11MB/103.9MB
 6c13c55b4b82 Extracting [====================>                              ]  43.45MB/103.9MB
 6c13c55b4b82 Extracting [======================>                            ]  46.79MB/103.9MB
 6c13c55b4b82 Extracting [=======================>                           ]  49.58MB/103.9MB
 6c13c55b4b82 Extracting [========================>                          ]  51.25MB/103.9MB
 6c13c55b4b82 Extracting [=========================>                         ]  52.92MB/103.9MB
 6c13c55b4b82 Extracting [==========================>                        ]  55.71MB/103.9MB
 6c13c55b4b82 Extracting [============================>                      ]  58.49MB/103.9MB
 6c13c55b4b82 Extracting [=============================>                     ]  61.83MB/103.9MB
 6c13c55b4b82 Extracting [===============================>                   ]  65.18MB/103.9MB
 6c13c55b4b82 Extracting [================================>                  ]  68.52MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  73.53MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.65MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]  75.76MB/103.9MB
 6c13c55b4b82 Extracting [=====================================>             ]  77.99MB/103.9MB
 6c13c55b4b82 Extracting [======================================>            ]  80.77MB/103.9MB
 6c13c55b4b82 Extracting [=======================================>           ]     83MB/103.9MB
 6c13c55b4b82 Extracting [=========================================>         ]  85.79MB/103.9MB
 6c13c55b4b82 Extracting [==========================================>        ]  89.13MB/103.9MB
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
#6 [backend internal] load metadata for docker.io/library/rust:1.89.0-alpine
#6 DONE 0.7s
#7 [backend internal] load metadata for docker.io/library/alpine:3.22
#7 DONE 0.8s
#8 [frontend internal] load metadata for docker.io/library/node:22-alpine
#8 DONE 0.8s
#9 [frontend internal] load .dockerignore
#9 transferring context: 2B done
#9 DONE 0.0s
#10 [backend internal] load .dockerignore
#10 transferring context: 2B done
#10 DONE 0.0s
#5 [website internal] load metadata for docker.io/library/node:18-alpine
#5 DONE 0.8s
#11 [website internal] load .dockerignore
#11 transferring context: 2B 0.0s done
#11 DONE 0.0s
#12 [backend builder  1/11] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 DONE 0.0s
#13 [frontend builder 1/7] FROM docker.io/library/node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9
#13 DONE 0.0s
#14 [backend stage-1 1/7] FROM docker.io/library/alpine:3.22@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#14 DONE 0.0s
#15 [backend internal] load build context
#15 transferring context: 73.66kB 0.0s done
#15 DONE 0.0s
#16 [frontend internal] load build context
#16 transferring context: 40.93kB 0.0s done
#16 DONE 0.0s
#17 [website base 1/1] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#17 DONE 0.0s
#18 [frontend builder 3/7] RUN apk add --no-cache python3 make g++
#18 CACHED
#19 [frontend builder 4/7] COPY package*.json ./
#19 CACHED
#20 [frontend builder 2/7] WORKDIR /app
#20 CACHED
#21 [frontend builder 5/7] RUN npm install
#21 CACHED
#22 [backend builder  3/11] RUN apk add --no-cache     pkgconfig     openssl-dev     postgresql-dev     musl-dev     gcc     curl
#22 CACHED
#23 [backend builder  2/11] WORKDIR /app
#23 CACHED
#24 [backend builder  4/11] RUN rustup target add x86_64-unknown-linux-musl
#24 CACHED
#25 [website internal] load build context
#25 transferring context: 7.37kB 0.1s done
#25 DONE 0.3s
#26 [frontend builder 6/7] COPY . .
#26 ...
#27 [website builder 3/5] COPY . .
#27 CACHED
#28 [website builder 5/5] RUN npm run build
#28 CACHED
#29 [website runner 4/8] COPY --from=builder /app/public ./public
#29 CACHED
#30 [website builder 4/5] RUN mkdir -p public
#30 CACHED
#31 [website runner 5/8] RUN mkdir .next
#31 CACHED
#32 [website runner 6/8] RUN chown nextjs:nodejs .next
#32 CACHED
#33 [website runner 3/8] RUN adduser --system --uid 1001 nextjs
#33 CACHED
#34 [website runner 7/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#34 CACHED
#35 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#35 CACHED
#36 [website builder 2/5] COPY --from=deps /app/node_modules ./node_modules
#36 CACHED
#37 [website deps 1/4] RUN apk add --no-cache libc6-compat
#37 CACHED
#38 [website deps 3/4] COPY package.json pnpm-lock.yaml* ./
#38 CACHED
#39 [website runner 2/8] RUN addgroup --system --gid 1001 nodejs
#39 CACHED
#40 [website builder 1/5] WORKDIR /app
#40 CACHED
#41 [website deps 2/4] WORKDIR /app
#41 CACHED
#42 [website runner 8/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#42 CACHED
#43 [website] exporting to image
#43 exporting layers done
#43 writing image sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a 0.0s done
#43 naming to docker.io/library/digitaloceandocker-website 0.1s done
#43 DONE 0.1s
#26 [frontend builder 6/7] COPY . .
#26 DONE 0.4s
#44 [backend builder  5/11] COPY Cargo.toml Cargo.lock* ./
#44 DONE 0.4s
#45 [website] resolving provenance for metadata file
#45 DONE 0.0s
#46 [backend builder  6/11] RUN mkdir src && echo "fn main() {}" > src/main.rs
#46 DONE 0.4s
#47 [backend builder  7/11] RUN cargo build --release
#47 0.563     Updating crates.io index
#47 2.945      Locking 2 packages to latest compatible versions
#47 2.946       Adding dotenv v0.15.0
#47 2.947       Adding ipnetwork v0.20.0 (available: v0.21.1)
#47 2.997  Downloading crates ...
#47 3.137   Downloaded sqlx-macros v0.8.6
#47 3.185   Downloaded jobserver v0.1.34
#47 3.219   Downloaded mime v0.3.17
#47 3.243   Downloaded md-5 v0.10.6
#47 3.257   Downloaded rand_core v0.6.4
#47 3.267   Downloaded quote v1.0.40
#47 3.282   Downloaded libm v0.2.15
#47 3.320   Downloaded sqlx v0.8.6
#47 3.359   Downloaded rustls-pki-types v1.12.0
#47 3.375   Downloaded sha1 v0.10.6
#47 3.384   Downloaded signal-hook-registry v1.4.6
#47 3.394   Downloaded num-conv v0.1.0
#47 3.401   Downloaded pem-rfc7468 v0.7.0
#47 3.409   Downloaded parking_lot_core v0.9.11
#47 3.417   Downloaded rand v0.9.2
#47 3.429   Downloaded rand v0.8.5
#47 3.440   Downloaded parking_lot v0.12.4
#47 3.449   Downloaded num-traits v0.2.19
#47 3.458   Downloaded pem v3.0.5
#47 3.464   Downloaded parking v2.2.1
#47 3.469   Downloaded jiff v0.2.15
#47 3.510   Downloaded libc v0.2.175
#47 3.578   Downloaded rsa v0.9.8
#47 3.594   Downloaded regex-lite v0.1.7
#47 3.604   Downloaded redis v0.24.0
#47 3.626   Downloaded libsqlite3-sys v0.30.1
#47 3.800   Downloaded serde v1.0.219
#47 3.810   Downloaded num-bigint v0.4.6
#47 3.823   Downloaded num-bigint-dig v0.8.4
#47 3.837   Downloaded mio v1.0.4
#47 3.854   Downloaded miniz_oxide v0.8.9
#47 3.863   Downloaded serde_json v1.0.143
#47 3.884   Downloaded reqwest v0.11.27
#47 3.904   Downloaded regex v1.11.2
#47 3.922   Downloaded openssl-sys v0.9.109
#47 3.935   Downloaded openssl v0.10.73
#47 3.957   Downloaded rustls-webpki v0.103.4
#47 3.967   Downloaded regex-syntax v0.8.6
#47 3.987   Downloaded rustls v0.23.31
#47 4.017   Downloaded zstd-sys v2.0.15+zstd.1.5.7
#47 4.063   Downloaded tokio v1.47.1
#47 4.159   Downloaded openssl-probe v0.1.6
#47 4.163   Downloaded openssl-macros v0.1.1
#47 4.167   Downloaded once_cell v1.21.3
#47 4.174   Downloaded num-iter v0.1.45
#47 4.178   Downloaded num-integer v0.1.46
#47 4.185   Downloaded nu-ansi-term v0.50.1
#47 4.193   Downloaded native-tls v0.2.14
#47 4.199   Downloaded simple_asn1 v0.6.3
#47 4.204   Downloaded zerocopy v0.8.26
#47 4.259   Downloaded webpki-***s v1.0.2
#47 4.271   Downloaded regex-automata v0.4.10
#47 4.308   Downloaded vcpkg v0.2.15
#47 4.415   Downloaded syn v2.0.106
#47 4.444   Downloaded signature v2.2.0
#47 4.449   Downloaded sharded-slab v0.1.7
#47 4.457   Downloaded sha2 v0.10.9
#47 4.464   Downloaded shlex v1.3.0
#47 4.469   Downloaded sha1_smol v1.0.1
#47 4.473   Downloaded serde_derive v1.0.219
#47 4.480   Downloaded serde_urlencoded v0.7.1
#47 4.486   Downloaded scopeguard v1.2.0
#47 4.490   Downloaded ryu v1.0.20
#47 4.498   Downloaded hyper v0.14.32
#47 4.519   Downloaded tracing-subscriber v0.3.20
#47 4.538   Downloaded rustls-pemfile v1.0.4
#47 4.545   Downloaded rand_core v0.9.3
#47 4.549   Downloaded idna v1.1.0
#47 4.559   Downloaded icu_properties_data v2.0.1
#47 4.581   Downloaded encoding_rs v0.8.35
#47 4.636   Downloaded indexmap v2.11.0
#47 4.648   Downloaded tokio-util v0.7.16
#47 4.665   Downloaded time v0.3.41
#47 4.684   Downloaded sqlx-postgres v0.8.6
#47 4.704   Downloaded brotli v8.0.2
#47 4.741   Downloaded proc-macro2 v1.0.101
#47 4.749   Downloaded ppv-lite86 v0.2.21
#47 4.755   Downloaded powerfmt v0.2.0
#47 4.759   Downloaded pkcs8 v0.10.2
#47 4.767   Downloaded pkcs1 v0.7.5
#47 4.773   Downloaded pin-utils v0.1.0
#47 4.777   Downloaded pin-project-lite v0.2.16
#47 4.790   Downloaded pin-project v1.1.10
#47 4.820   Downloaded icu_locale_core v2.0.0
#47 4.836   Downloaded icu_collections v2.0.0
#47 4.850   Downloaded zerovec v0.11.4
#47 4.864   Downloaded zerotrie v0.2.2
#47 4.874   Downloaded uuid v1.18.0
#47 4.883   Downloaded url v2.5.7
#47 4.891   Downloaded unicode-normalization v0.1.24
#47 4.901   Downloaded typenum v1.18.0
#47 4.910   Downloaded sqlx-core v0.8.6
#47 4.930   Downloaded rand_chacha v0.9.0
#47 4.935   Downloaded rand_chacha v0.3.1
#47 4.939   Downloaded potential_utf v0.1.3
#47 4.943   Downloaded pkg-config v0.3.32
#47 4.947   Downloaded ring v0.17.14
#47 5.094   Downloaded pin-project-internal v1.1.10
#47 5.097   Downloaded percent-encoding v2.3.2
#47 5.101   Downloaded memchr v2.7.5
#47 5.114   Downloaded language-tags v0.3.2
#47 5.119   Downloaded jsonwebtoken v9.3.1
#47 5.139   Downloaded icu_provider v2.0.0
#47 5.153   Downloaded icu_properties v2.0.1
#47 5.160   Downloaded icu_normalizer_data v2.0.0
#47 5.167   Downloaded icu_normalizer v2.0.0
#47 5.183   Downloaded zstd v0.13.3
#47 5.193   Downloaded tracing v0.1.41
#47 5.208   Downloaded hkdf v0.12.4
#47 5.215   Downloaded hashbrown v0.15.5
#47 5.227   Downloaded h2 v0.3.27
#47 5.241   Downloaded futures-util v0.3.31
#47 5.270   Downloaded combine v4.6.7
#47 5.283   Downloaded chrono v0.4.41
#47 5.301   Downloaded brotli-decompressor v5.0.0
#47 5.316   Downloaded aho-corasick v1.1.3
#47 5.335   Downloaded actix-web v4.11.0
#47 5.376   Downloaded log v0.4.27
#47 5.383   Downloaded lock_api v0.4.13
#47 5.386   Downloaded local-waker v0.1.4
#47 5.389   Downloaded local-channel v0.1.5
#47 5.391   Downloaded litemap v0.8.0
#47 5.398   Downloaded itoa v1.0.15
#47 5.402   Downloaded ipnet v2.11.0
#47 5.409   Downloaded idna_adapter v1.2.1
#47 5.412   Downloaded iana-time-zone v0.1.63
#47 5.419   Downloaded hyper-tls v0.5.0
#47 5.422   Downloaded httpdate v1.0.3
#47 5.426   Downloaded zstd-safe v7.2.4
#47 5.430   Downloaded zerovec-derive v0.11.1
#47 5.435   Downloaded yoke v0.8.0
#47 5.439   Downloaded version_check v0.9.5
#47 5.445   Downloaded utf8parse v0.2.2
#47 5.454   Downloaded utf8_iter v1.0.4
#47 5.457   Downloaded untrusted v0.9.0
#47 5.461   Downloaded unicode-properties v0.1.3
#47 5.466   Downloaded unicode-ident v1.0.18
#47 5.475   Downloaded unicode-bidi v0.3.18
#47 5.486   Downloaded tracing-core v0.1.34
#47 5.493   Downloaded tracing-attributes v0.1.30
#47 5.502   Downloaded tinyvec v1.10.0
#47 5.513   Downloaded sqlx-sqlite v0.8.6
#47 5.525   Downloaded sqlx-mysql v0.8.6
#47 5.540   Downloaded socket2 v0.6.0
#47 5.545   Downloaded socket2 v0.5.10
#47 5.551   Downloaded http v0.2.12
#47 5.561   Downloaded hmac v0.12.1
#47 5.566   Downloaded hashlink v0.10.0
#47 5.571   Downloaded getrandom v0.3.3
#47 5.581   Downloaded getrandom v0.2.16
#47 5.588   Downloaded futures-intrusive v0.5.0
#47 5.599   Downloaded futures-channel v0.3.31
#47 5.605   Downloaded futures v0.3.31
#47 5.617   Downloaded flume v0.11.1
#47 5.627   Downloaded flate2 v1.1.2
#47 5.638   Downloaded event-listener v5.4.1
#47 5.645   Downloaded derive_more-impl v2.0.1
#47 5.656   Downloaded derive_more v2.0.1
#47 5.678   Downloaded der v0.7.10
#47 5.691   Downloaded crossbeam-channel v0.5.15
#47 5.701   Downloaded crc32fast v1.5.0
#47 5.707   Downloaded cc v1.2.34
#47 5.716   Downloaded bytes v1.10.1
#47 5.729   Downloaded anyhow v1.0.99
#47 5.740   Downloaded actix-http v3.11.1
#47 5.761   Downloaded matchers v0.2.0
#47 5.765   Downloaded lazy_static v1.5.0
#47 5.770   Downloaded ipnetwork v0.20.0
#47 5.775   Downloaded impl-more v0.1.9
#47 5.783   Downloaded zerofrom-derive v0.1.6
#47 5.786   Downloaded zerofrom v0.1.6
#47 5.789   Downloaded yoke-derive v0.8.0
#47 5.792   Downloaded writeable v0.6.1
#47 5.797   Downloaded whoami v1.6.1
#47 5.806   Downloaded webpki-***s v0.26.11
#47 5.806   Downloaded want v0.3.1
#47 5.809   Downloaded unicode-xid v0.2.6
#47 5.813   Downloaded tower-service v0.3.3
#47 5.816   Downloaded tokio-stream v0.1.17
#47 5.826   Downloaded tokio-native-tls v0.3.1
#47 5.831   Downloaded tokio-macros v2.5.0
#47 5.835   Downloaded tinystr v0.8.1
#47 5.840   Downloaded time-macros v0.2.22
#47 5.847   Downloaded time-core v0.1.4
#47 5.850   Downloaded thread_local v1.1.9
#47 5.855   Downloaded thiserror-impl v2.0.16
#47 5.858   Downloaded thiserror v2.0.16
#47 5.872   Downloaded synstructure v0.13.2
#47 5.876   Downloaded subtle v2.6.1
#47 5.879   Downloaded stringprep v0.1.5
#47 5.883   Downloaded stable_deref_trait v1.2.0
#47 5.886   Downloaded sqlx-macros-core v0.8.6
#47 5.894   Downloaded spki v0.7.3
#47 5.901   Downloaded spin v0.9.8
#47 5.911   Downloaded socket2 v0.4.10
#47 5.913   Downloaded smallvec v1.15.1
#47 5.919   Downloaded slab v0.4.11
#47 5.923   Downloaded httparse v1.10.1
#47 5.930   Downloaded http-body v0.4.6
#47 5.935   Downloaded home v0.5.11
#47 5.938   Downloaded hex v0.4.3
#47 5.943   Downloaded heck v0.5.0
#47 5.946   Downloaded generic-array v0.14.7
#47 5.951   Downloaded futures-task v0.3.31
#47 5.954   Downloaded futures-sink v0.3.31
#47 5.959   Downloaded futures-macro v0.3.31
#47 5.963   Downloaded futures-io v0.3.31
#47 5.966   Downloaded futures-executor v0.3.31
#47 5.970   Downloaded futures-core v0.3.31
#47 5.974   Downloaded form_urlencoded v1.2.2
#47 5.977   Downloaded foreign-types-shared v0.1.1
#47 5.979   Downloaded foldhash v0.1.5
#47 5.983   Downloaded fnv v1.0.7
#47 5.985   Downloaded equivalent v1.0.2
#47 5.988   Downloaded env_logger v0.11.8
#47 5.995   Downloaded env_filter v0.1.3
#47 5.999   Downloaded either v1.15.0
#47 6.003   Downloaded dotenvy v0.15.7
#47 6.018   Downloaded dotenv v0.15.0
#47 6.028   Downloaded crypto-common v0.1.6
#47 6.030   Downloaded crossbeam-utils v0.8.21
#47 6.039   Downloaded crossbeam-queue v0.3.12
#47 6.047   Downloaded crc-catalog v2.4.0
#47 6.055   Downloaded crc v3.3.0
#47 6.058   Downloaded cpufeatures v0.2.17
#47 6.065   Downloaded cookie v0.16.2
#47 6.071   Downloaded concurrent-queue v2.5.0
#47 6.076   Downloaded cipher v0.4.4
#47 6.081   Downloaded cfg-if v1.0.3
#47 6.085   Downloaded byteorder v1.5.0
#47 6.089   Downloaded blowfish v0.9.1
#47 6.092   Downloaded block-buffer v0.10.4
#47 6.096   Downloaded bitflags v2.9.3
#47 6.105   Downloaded bcrypt v0.15.1
#47 6.110   Downloaded base64 v0.22.1
#47 6.124   Downloaded base64 v0.21.7
#47 6.131   Downloaded allocator-api2 v0.2.21
#47 6.137   Downloaded adler2 v2.0.1
#47 6.140   Downloaded actix_derive v0.6.2
#47 6.144   Downloaded actix-server v2.6.0
#47 6.150   Downloaded is_terminal_polyfill v1.70.1
#47 6.153   Downloaded inout v0.1.4
#47 6.156   Downloaded zeroize v1.8.1
#47 6.160   Downloaded try-lock v0.2.5
#47 6.162   Downloaded tracing-log v0.2.0
#47 6.165   Downloaded tokio-retry v0.3.0
#47 6.168   Downloaded tinyvec_macros v0.1.1
#47 6.170   Downloaded sync_wrapper v0.1.2
#47 6.175   Downloaded foreign-types v0.3.2
#47 6.177   Downloaded displaydoc v0.2.5
#47 6.183   Downloaded digest v0.10.7
#47 6.187   Downloaded deranged v0.4.0
#47 6.191   Downloaded const-oid v0.9.6
#47 6.196   Downloaded colorchoice v1.0.4
#47 6.199   Downloaded bytestring v1.4.0
#47 6.203   Downloaded atoi v2.0.0
#47 6.206   Downloaded async-trait v0.1.89
#47 6.213   Downloaded anstyle-query v1.1.4
#47 6.217   Downloaded alloc-no-stdlib v2.0.4
#47 6.221   Downloaded actix-service v2.0.3
#47 6.225   Downloaded actix-rt v2.10.0
#47 6.229   Downloaded actix-router v0.5.3
#47 6.233   Downloaded actix-macros v0.2.4
#47 6.238   Downloaded actix-cors v0.7.1
#47 6.243   Downloaded actix-codec v0.5.2
#47 6.247   Downloaded actix v0.13.5
#47 6.257   Downloaded base64ct v1.8.0
#47 6.263   Downloaded autocfg v1.5.0
#47 6.268   Downloaded arc-swap v1.7.1
#47 6.284   Downloaded anstyle-parse v0.2.7
#47 6.288   Downloaded anstyle v1.0.11
#47 6.292   Downloaded anstream v0.6.20
#47 6.298   Downloaded alloc-stdlib v0.2.2
#47 6.301   Downloaded actix-web-codegen v4.3.0
#47 6.307   Downloaded actix-utils v3.0.1
#47 6.661    Compiling proc-macro2 v1.0.101
#47 6.662    Compiling unicode-ident v1.0.18
#47 7.069    Compiling libc v0.2.175
#47 8.161    Compiling serde v1.0.219
#47 ...
#48 [frontend builder 7/7] RUN echo "Starting build process..." &&     npm run build &&     echo "Build completed. Checking standalone output..." &&     ls -la .next/ &&     ls -la .next/standalone/ || echo "Standalone directory not found!" &&     echo "Build verification complete."
#48 0.352 Starting build process...
#48 0.681 
#48 0.681 > frontend@0.1.0 build
#48 0.681 > next build
#48 0.681 
#48 2.594 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#48 2.595 This information is used to shape Next.js' roadmap and prioritize features.
#48 2.596 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#48 2.596 https://nextjs.org/telemetry
#48 2.596 
#48 2.760    ▲ Next.js 15.5.2
#48 2.762 
#48 3.006    Creating an optimized production build ...
#48 ...
#47 [backend builder  7/11] RUN cargo build --release
#47 11.06    Compiling quote v1.0.40
#47 12.53    Compiling syn v2.0.106
#47 13.72    Compiling cfg-if v1.0.3
#47 13.88    Compiling autocfg v1.5.0
#47 21.47    Compiling jobserver v0.1.34
#47 23.11    Compiling shlex v1.3.0
#47 23.81    Compiling cc v1.2.34
#47 33.60    Compiling version_check v0.9.5
#47 34.84    Compiling typenum v1.18.0
#47 35.85    Compiling synstructure v0.13.2
#47 38.19    Compiling generic-array v0.14.7
#47 38.84    Compiling lock_api v0.4.13
#47 39.49    Compiling parking_lot_core v0.9.11
#47 40.26    Compiling pin-project-lite v0.2.16
#47 40.51    Compiling log v0.4.27
#47 41.59    Compiling memchr v2.7.5
#47 44.08    Compiling serde_derive v1.0.219
#47 ...
#48 [frontend builder 7/7] RUN echo "Starting build process..." &&     npm run build &&     echo "Build completed. Checking standalone output..." &&     ls -la .next/ &&     ls -la .next/standalone/ || echo "Standalone directory not found!" &&     echo "Build verification complete."
#48 45.78  ✓ Compiled successfully in 42s
#48 45.80    Skipping validation of types
#48 45.80    Skipping linting
#48 46.52    Collecting page data ...
#48 51.42    Generating static pages (0/8) ...
#48 54.88    Generating static pages (2/8) 
#48 54.88    Generating static pages (4/8) 
#48 54.88    Generating static pages (6/8) 
#48 54.88  ✓ Generating static pages (8/8)
#48 56.44    Finalizing page optimization ...
#48 ...
#47 [backend builder  7/11] RUN cargo build --release
#47 46.04    Compiling zerofrom-derive v0.1.6
#47 52.06    Compiling yoke-derive v0.8.0
#47 ...
#48 [frontend builder 7/7] RUN echo "Starting build process..." &&     npm run build &&     echo "Build completed. Checking standalone output..." &&     ls -la .next/ &&     ls -la .next/standalone/ || echo "Standalone directory not found!" &&     echo "Build verification complete."
#48 56.45    Collecting build traces ...
#48 ...
#47 [backend builder  7/11] RUN cargo build --release
#47 57.29    Compiling zerovec-derive v0.11.1
#47 63.42    Compiling displaydoc v0.2.5
#47 66.81    Compiling bytes v1.10.1
#47 71.77    Compiling futures-core v0.3.31
#47 72.49    Compiling scopeguard v1.2.0
#47 73.85    Compiling icu_normalizer_data v2.0.0
#47 74.29    Compiling icu_properties_data v2.0.1
#47 74.86    Compiling tracing-attributes v0.1.30
#47 77.97    Compiling smallvec v1.15.1
#47 80.52    Compiling parking_lot v0.12.4
#47 82.48    Compiling zerocopy v0.8.26
#47 83.32    Compiling once_cell v1.21.3
#47 83.67    Compiling tokio-macros v2.5.0
#47 84.24    Compiling mio v1.0.4
#47 86.62    Compiling signal-hook-registry v1.4.6
#47 86.64    Compiling socket2 v0.6.0
#47 88.83    Compiling futures-sink v0.3.31
#47 89.26    Compiling tokio v1.47.1
#47 89.91    Compiling zerofrom v0.1.6
#47 90.50    Compiling stable_deref_trait v1.2.0
#47 90.66    Compiling itoa v1.0.15
#47 90.98    Compiling yoke v0.8.0
#47 ...
#48 [frontend builder 7/7] RUN echo "Starting build process..." &&     npm run build &&     echo "Build completed. Checking standalone output..." &&     ls -la .next/ &&     ls -la .next/standalone/ || echo "Standalone directory not found!" &&     echo "Build verification complete."
#48 100.9 
#48 100.9 Route (app)                                 Size  First Load JS
#48 100.9 ┌ ○ /                                    67.9 kB         211 kB
#48 100.9 ├ ○ /_not-found                            991 B         103 kB
#48 100.9 ├ ○ /admin                               3.16 kB         125 kB
#48 100.9 ├ ○ /admin/login                         3.35 kB         147 kB
#48 100.9 └ ○ /login                               2.66 kB         157 kB
#48 100.9 + First Load JS shared by all             102 kB
#48 100.9   ├ chunks/255-310f1cc3c9beb704.js       45.7 kB
#48 100.9   ├ chunks/4bd1b696-c023c6e3521b1417.js  54.2 kB
#48 100.9   └ other shared chunks (total)          1.93 kB
#48 100.9 
#48 100.9 
#48 100.9 ○  (Static)  prerendered as static content
#48 100.9 
#48 101.1 
#48 101.1 > frontend@0.1.0 postbuild
#48 101.1 > echo 'Build completed. Verifying standalone output...' && ls -la .next/ && ls -la .next/standalone/ || echo 'WARNING: Standalone directory not found!'
#48 101.1 
#48 101.1 Build completed. Verifying standalone output...
#48 101.1 total 640
#48 101.1 drwxr-xr-x    8 ***     ***          4096 Sep  2 14:38 .
#48 101.1 drwxr-xr-x    1 ***     ***          4096 Sep  2 14:36 ..
#48 101.1 -rw-r--r--    1 ***     ***            21 Sep  2 14:37 BUILD_ID
#48 101.1 -rw-r--r--    1 ***     ***          2825 Sep  2 14:37 app-build-manifest.json
#48 101.1 -rw-r--r--    1 ***     ***           188 Sep  2 14:37 app-path-routes-manifest.json
#48 101.1 -rw-r--r--    1 ***     ***           995 Sep  2 14:37 build-manifest.json
#48 101.1 drwxr-xr-x    4 ***     ***          4096 Sep  2 14:37 cache
#48 101.1 drwxr-xr-x    2 ***     ***          4096 Sep  2 14:36 diagnostics
#48 101.1 -rw-r--r--    1 ***     ***           111 Sep  2 14:37 export-marker.json
#48 101.1 -rw-r--r--    1 ***     ***           867 Sep  2 14:37 images-manifest.json
#48 101.1 -rw-r--r--    1 ***     ***          7826 Sep  2 14:38 next-minimal-server.js.nft.json
#48 101.1 -rw-r--r--    1 ***     ***        120508 Sep  2 14:38 next-server.js.nft.json
#48 101.1 -rw-r--r--    1 ***     ***            20 Sep  2 14:36 package.json
#48 101.1 -rw-r--r--    1 ***     ***          4254 Sep  2 14:37 prerender-manifest.json
#48 101.1 -rw-r--r--    1 ***     ***             2 Sep  2 14:37 react-loadable-manifest.json
#48 101.1 -rw-r--r--    1 ***     ***          9072 Sep  2 14:37 required-server-files.json
#48 101.1 -rw-r--r--    1 ***     ***          1877 Sep  2 14:37 routes-manifest.json
#48 101.1 drwxr-xr-x    5 ***     ***          4096 Sep  2 14:37 server
#48 101.1 drwxr-xr-x    4 ***     ***          4096 Sep  2 14:38 standalone
#48 101.1 drwxr-xr-x    5 ***     ***          4096 Sep  2 14:37 static
#48 101.1 -rw-r--r--    1 ***     ***        433364 Sep  2 14:38 trace
#48 101.1 drwxr-xr-x    3 ***     ***          4096 Sep  2 14:37 types
#48 101.1 total 28
#48 101.1 drwxr-xr-x    4 ***     ***          4096 Sep  2 14:38 .
#48 101.1 drwxr-xr-x    8 ***     ***          4096 Sep  2 14:38 ..
#48 101.1 drwxr-xr-x    3 ***     ***          4096 Sep  2 14:38 .next
#48 101.1 drwxr-xr-x   23 ***     ***          4096 Sep  2 14:38 node_modules
#48 101.1 -rw-r--r--    1 ***     ***          1504 Sep  2 14:38 package.json
#48 101.1 -rw-r--r--    1 ***     ***          6500 Sep  2 14:38 server.js
#48 101.2 Build completed. Checking standalone output...
#48 101.2 total 640
#48 101.2 drwxr-xr-x    8 ***     ***          4096 Sep  2 14:38 .
#48 101.2 drwxr-xr-x    1 ***     ***          4096 Sep  2 14:36 ..
#48 101.2 -rw-r--r--    1 ***     ***            21 Sep  2 14:37 BUILD_ID
#48 101.2 -rw-r--r--    1 ***     ***          2825 Sep  2 14:37 app-build-manifest.json
#48 101.2 -rw-r--r--    1 ***     ***           188 Sep  2 14:37 app-path-routes-manifest.json
#48 101.2 -rw-r--r--    1 ***     ***           995 Sep  2 14:37 build-manifest.json
#48 101.2 drwxr-xr-x    4 ***     ***          4096 Sep  2 14:37 cache
#48 101.2 drwxr-xr-x    2 ***     ***          4096 Sep  2 14:36 diagnostics
#48 101.2 -rw-r--r--    1 ***     ***           111 Sep  2 14:37 export-marker.json
#48 101.2 -rw-r--r--    1 ***     ***           867 Sep  2 14:37 images-manifest.json
#48 101.2 -rw-r--r--    1 ***     ***          7826 Sep  2 14:38 next-minimal-server.js.nft.json
#48 101.2 -rw-r--r--    1 ***     ***        120508 Sep  2 14:38 next-server.js.nft.json
#48 101.2 -rw-r--r--    1 ***     ***            20 Sep  2 14:36 package.json
#48 101.2 -rw-r--r--    1 ***     ***          4254 Sep  2 14:37 prerender-manifest.json
#48 101.2 -rw-r--r--    1 ***     ***             2 Sep  2 14:37 react-loadable-manifest.json
#48 101.2 -rw-r--r--    1 ***     ***          9072 Sep  2 14:37 required-server-files.json
#48 101.2 -rw-r--r--    1 ***     ***          1877 Sep  2 14:37 routes-manifest.json
#48 101.2 drwxr-xr-x    5 ***     ***          4096 Sep  2 14:37 server
#48 101.2 drwxr-xr-x    4 ***     ***          4096 Sep  2 14:38 standalone
#48 101.2 drwxr-xr-x    5 ***     ***          4096 Sep  2 14:37 static
#48 101.2 -rw-r--r--    1 ***     ***        433364 Sep  2 14:38 trace
#48 101.2 drwxr-xr-x    3 ***     ***          4096 Sep  2 14:37 types
#48 101.2 total 28
#48 101.2 drwxr-xr-x    4 ***     ***          4096 Sep  2 14:38 .
#48 101.2 drwxr-xr-x    8 ***     ***          4096 Sep  2 14:38 ..
#48 101.2 drwxr-xr-x    3 ***     ***          4096 Sep  2 14:38 .next
#48 101.2 drwxr-xr-x   23 ***     ***          4096 Sep  2 14:38 node_modules
#48 101.2 -rw-r--r--    1 ***     ***          1504 Sep  2 14:38 package.json
#48 101.2 -rw-r--r--    1 ***     ***          6500 Sep  2 14:38 server.js
#48 101.2 Build verification complete.
#48 DONE 101.3s
#47 [backend builder  7/11] RUN cargo build --release
#47 ...
#49 [frontend runner 2/7] RUN apk add --no-cache dumb-init
#49 CACHED
#50 [frontend runner 3/7] RUN addgroup -g 1001 -S nodejs &&     adduser -u 1001 -S nextjs -G nodejs
#50 CACHED
#51 [frontend runner 4/7] WORKDIR /app
#51 CACHED
#52 [frontend runner 5/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#52 DONE 0.6s
#47 [backend builder  7/11] RUN cargo build --release
#47 ...
#53 [frontend runner 6/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#53 DONE 0.0s
#54 [frontend runner 7/7] RUN mkdir -p ./public
#54 DONE 0.4s
#47 [backend builder  7/11] RUN cargo build --release
#47 ...
#55 [frontend] exporting to image
#55 exporting layers
#55 exporting layers 1.1s done
#55 writing image sha256:3433d6a717ac0bea5e019788e7735427aff300d81c07519034068b8f63927f7d
#55 writing image sha256:3433d6a717ac0bea5e019788e7735427aff300d81c07519034068b8f63927f7d done
#55 naming to docker.io/library/digitaloceandocker-frontend done
#55 DONE 1.2s
#56 [frontend] resolving provenance for metadata file
#56 DONE 0.0s
#47 [backend builder  7/11] RUN cargo build --release
#47 106.7    Compiling crossbeam-utils v0.8.21
#47 107.1    Compiling pkg-config v0.3.32
#47 110.3    Compiling zerovec v0.11.4
#47 113.1    Compiling futures-channel v0.3.31
#47 113.6    Compiling tracing-core v0.1.34
#47 115.3    Compiling futures-macro v0.3.31
#47 117.1    Compiling futures-task v0.3.31
#47 117.3    Compiling pin-utils v0.1.0
#47 117.4    Compiling futures-io v0.3.31
#47 117.7    Compiling slab v0.4.11
#47 118.0    Compiling futures-util v0.3.31
#47 121.6    Compiling crypto-common v0.1.6
#47 121.8    Compiling serde_json v1.0.143
#47 122.0    Compiling tracing v0.1.41
#47 122.8    Compiling tinystr v0.8.1
#47 123.4    Compiling subtle v2.6.1
#47 123.7    Compiling litemap v0.8.0
#47 124.3    Compiling writeable v0.6.1
#47 125.4    Compiling icu_locale_core v2.0.0
#47 128.2    Compiling potential_utf v0.1.3
#47 128.5    Compiling zerotrie v0.2.2
#47 129.5    Compiling getrandom v0.2.16
#47 129.5    Compiling equivalent v1.0.2
#47 129.6    Compiling thiserror v2.0.16
#47 129.9    Compiling foldhash v0.1.5
#47 130.1    Compiling allocator-api2 v0.2.21
#47 131.0    Compiling hashbrown v0.15.5
#47 132.8    Compiling icu_provider v2.0.0
#47 133.4    Compiling icu_collections v2.0.0
#47 135.4    Compiling block-buffer v0.10.4
#47 137.1    Compiling percent-encoding v2.3.2
#47 138.2    Compiling bitflags v2.9.3
#47 139.7    Compiling getrandom v0.3.3
#47 141.8    Compiling ppv-lite86 v0.2.21
#47 143.2    Compiling digest v0.10.7
#47 143.8    Compiling tokio-util v0.7.16
#47 144.5    Compiling thiserror-impl v2.0.16
#47 145.5    Compiling num-traits v0.2.19
#47 145.8    Compiling rustls v0.23.31
#47 147.4    Compiling icu_properties v2.0.1
#47 147.9    Compiling icu_normalizer v2.0.0
#47 151.1    Compiling indexmap v2.11.0
#47 152.2    Compiling ring v0.17.14
#47 153.2    Compiling zeroize v1.8.1
#47 153.4    Compiling fnv v1.0.7
#47 153.5    Compiling ryu v1.0.20
#47 153.8    Compiling vcpkg v0.2.15
#47 154.5    Compiling http v0.2.12
#47 155.2    Compiling openssl-sys v0.9.109
#47 156.1    Compiling rustls-pki-types v1.12.0
#47 158.5    Compiling idna_adapter v1.2.1
#47 160.9    Compiling form_urlencoded v1.2.2
#47 161.3    Compiling aho-corasick v1.1.3
#47 165.1    Compiling utf8_iter v1.0.4
#47 165.4    Compiling regex-syntax v0.8.6
#47 169.3    Compiling base64 v0.22.1
#47 170.1    Compiling idna v1.1.0
#47 173.5    Compiling regex-automata v0.4.10
#47 198.0    Compiling zstd-sys v2.0.15+zstd.1.5.7
#47 201.1    Compiling httparse v1.10.1
#47 201.4    Compiling cpufeatures v0.2.17
#47 203.2    Compiling untrusted v0.9.0
#47 226.9    Compiling url v2.5.7
#47 236.5    Compiling tinyvec_macros v0.1.1
#47 236.5    Compiling powerfmt v0.2.0
#47 237.4    Compiling num-conv v0.1.0
#47 237.8    Compiling time-core v0.1.4
#47 239.8    Compiling time-macros v0.2.22
#47 251.2    Compiling deranged v0.4.0
#47 253.8    Compiling tinyvec v1.10.0
#47 271.0    Compiling rustls-webpki v0.103.4
#47 274.4    Compiling concurrent-queue v2.5.0
#47 274.8    Compiling webpki-***s v1.0.2
#47 275.0    Compiling h2 v0.3.27
#47 293.2    Compiling rand_core v0.6.4
#47 294.4    Compiling socket2 v0.5.10
#47 296.2    Compiling httpdate v1.0.3
#47 296.7    Compiling zstd-safe v7.2.4
#47 296.9    Compiling iana-time-zone v0.1.63
#47 297.0    Compiling openssl v0.10.73
#47 297.4    Compiling alloc-no-stdlib v2.0.4
#47 297.5    Compiling parking v2.2.1
#47 297.8    Compiling foreign-types-shared v0.1.1
#47 297.9    Compiling crc32fast v1.5.0
#47 298.2    Compiling local-waker v0.1.4
#47 298.4    Compiling crc-catalog v2.4.0
#47 298.5    Compiling crc v3.3.0
#47 298.9    Compiling sha2 v0.10.9
#47 303.0    Compiling time v0.3.41
#47 306.4    Compiling foreign-types v0.3.2
#47 306.5    Compiling event-listener v5.4.1
#47 307.0    Compiling alloc-stdlib v0.2.2
#47 307.2    Compiling chrono v0.4.41
#47 311.1    Compiling rand_chacha v0.3.1
#47 313.2    Compiling webpki-***s v0.26.11
#47 314.4    Compiling futures-intrusive v0.5.0
#47 315.8    Compiling tokio-stream v0.1.17
#47 317.3    Compiling unicode-normalization v0.1.24
#47 320.9    Compiling hashlink v0.10.0
#47 326.1    Compiling crossbeam-queue v0.3.12
#47 326.4    Compiling regex v1.11.2
#47 328.9    Compiling hmac v0.12.1
#47 329.1    Compiling rand_core v0.9.3
#47 329.4    Compiling actix-rt v2.10.0
#47 329.6    Compiling either v1.15.0
#47 330.2    Compiling openssl-macros v0.1.1
#47 331.0    Compiling adler2 v2.0.1
#47 331.2    Compiling unicode-properties v0.1.3
#47 331.7    Compiling unicode-bidi v0.3.18
#47 333.0    Compiling unicode-xid v0.2.6
#47 333.2    Compiling native-tls v0.2.14
#47 333.5    Compiling uuid v1.18.0
#47 335.0    Compiling sqlx-core v0.8.6
#47 335.3    Compiling derive_more-impl v2.0.1
#47 343.3    Compiling stringprep v0.1.5
#47 344.1    Compiling miniz_oxide v0.8.9
#47 346.5    Compiling rand_chacha v0.9.0
#47 347.9    Compiling hkdf v0.12.4
#47 348.1    Compiling rand v0.8.5
#47 351.9    Compiling brotli-decompressor v5.0.0
#47 356.0    Compiling actix-utils v3.0.1
#47 357.5    Compiling atoi v2.0.0
#47 358.1    Compiling md-5 v0.10.6
#47 358.3    Compiling bytestring v1.4.0
#47 358.7    Compiling actix-service v2.0.3
#47 359.8    Compiling cookie v0.16.2
#47 360.1    Compiling encoding_rs v0.8.35
#47 360.7    Compiling byteorder v1.5.0
#47 361.2    Compiling whoami v1.6.1
#47 361.7    Compiling try-lock v0.2.5
#47 362.7    Compiling dotenvy v0.15.7
#47 363.3    Compiling hex v0.4.3
#47 364.7    Compiling regex-lite v0.1.7
#47 366.0    Compiling openssl-probe v0.1.6
#47 366.5    Compiling home v0.5.11
#47 366.6    Compiling mime v0.3.17
#47 367.4    Compiling sqlx-postgres v0.8.6
#47 368.7    Compiling actix-router v0.5.3
#47 378.9    Compiling want v0.3.1
#47 386.4    Compiling flate2 v1.1.2
#47 387.6    Compiling brotli v8.0.2
#47 400.0    Compiling zstd v0.13.3
#47 401.0    Compiling rand v0.9.2
#47 404.8    Compiling derive_more v2.0.1
#47 404.9    Compiling local-channel v0.1.5
#47 407.0    Compiling sha1 v0.10.6
#47 407.9    Compiling serde_urlencoded v0.7.1
#47 408.5    Compiling num-integer v0.1.46
#47 409.1    Compiling http-body v0.4.6
#47 409.7    Compiling actix-codec v0.5.2
#47 411.5    Compiling inout v0.1.4
#47 412.4    Compiling actix-macros v0.2.4
#47 412.8    Compiling pin-project-internal v1.1.10
#47 413.2    Compiling language-tags v0.3.2
#47 415.8    Compiling utf8parse v0.2.2
#47 415.9    Compiling heck v0.5.0
#47 416.3    Compiling tower-service v0.3.3
#47 422.5    Compiling hyper v0.14.32
#47 422.8    Compiling sqlx-macros-core v0.8.6
#47 425.4    Compiling anstyle-parse v0.2.7
#47 425.8    Compiling pin-project v1.1.10
#47 425.9    Compiling actix-http v3.11.1
#47 448.5    Compiling cipher v0.4.4
#47 449.4    Compiling num-bigint v0.4.6
#47 451.4    Compiling actix-web-codegen v4.3.0
#47 453.5    Compiling tokio-native-tls v0.3.1
#47 453.7    Compiling actix-server v2.6.0
#47 456.4    Compiling futures-executor v0.3.31
#47 457.9    Compiling anyhow v1.0.99
#47 460.0    Compiling anstyle v1.0.11
#47 460.6    Compiling impl-more v0.1.9
#47 460.7    Compiling base64 v0.21.7
#47 461.7    Compiling colorchoice v1.0.4
#47 462.0    Compiling anstyle-query v1.1.4
#47 462.1    Compiling lazy_static v1.5.0
#47 463.1    Compiling is_terminal_polyfill v1.70.1
#47 463.2    Compiling anstream v0.6.20
#47 465.2    Compiling sharded-slab v0.1.7
#47 467.6    Compiling rustls-pemfile v1.0.4
#47 468.2    Compiling actix-web v4.11.0
#47 487.4    Compiling futures v0.3.31
#47 487.5    Compiling hyper-tls v0.5.0
#47 487.9    Compiling simple_asn1 v0.6.3
#47 490.0    Compiling blowfish v0.9.1
#47 490.3    Compiling tokio-retry v0.3.0
#47 490.7    Compiling sqlx-macros v0.8.6
#47 492.6    Compiling env_filter v0.1.3
#47 493.7    Compiling crossbeam-channel v0.5.15
#47 495.4    Compiling matchers v0.2.0
#47 496.2    Compiling pem v3.0.5
#47 500.5    Compiling combine v4.6.7
#47 519.7    Compiling tracing-log v0.2.0
#47 520.5    Compiling async-trait v0.1.89
#47 522.4    Compiling actix_derive v0.6.2
#47 523.4    Compiling socket2 v0.4.10
#47 523.8    Compiling thread_local v1.1.9
#47 524.5    Compiling sync_wrapper v0.1.2
#47 524.6    Compiling sha1_smol v1.0.1
#47 524.7    Compiling jiff v0.2.15
#47 525.3    Compiling nu-ansi-term v0.50.1
#47 526.4    Compiling ipnet v2.11.0
#47 528.5    Compiling arc-swap v1.7.1
#47 529.3    Compiling redis v0.24.0
#47 547.3    Compiling env_logger v0.11.8
#47 549.3    Compiling reqwest v0.11.27
#47 553.0    Compiling tracing-subscriber v0.3.20
#47 563.5    Compiling actix v0.13.5
#47 566.9    Compiling jsonwebtoken v9.3.1
#47 572.9    Compiling sqlx v0.8.6
#47 573.0    Compiling bcrypt v0.15.1
#47 575.3    Compiling actix-cors v0.7.1
#47 577.9    Compiling ipnetwork v0.20.0
#47 578.1    Compiling dotenv v0.15.0
#47 579.3    Compiling viworks-admin-backend v0.1.0 (/app)
#47 589.5     Finished `release` profile [optimized] target(s) in 9m 49s
#47 589.5 warning: the following packages contain code that will be rejected by a future version of Rust: redis v0.24.0
#47 589.5 note: to see what the problems were, use the option `--future-incompat-report`, or run `cargo report future-incompatibilities --id 1`
#47 DONE 589.9s
#57 [backend builder  8/11] RUN rm src/main.rs
#57 DONE 0.3s
#58 [backend builder  9/11] COPY src ./src
#58 DONE 0.1s
#59 [backend builder 10/11] COPY migrations ./migrations
#59 DONE 0.0s
#60 [backend builder 11/11] RUN cargo build --release
#60 1.179     Finished `release` profile [optimized] target(s) in 0.83s
#60 1.179 warning: the following packages contain code that will be rejected by a future version of Rust: redis v0.24.0
#60 1.196 note: to see what the problems were, use the option `--future-incompat-report`, or run `cargo report future-incompatibilities --id 1`
#60 DONE 1.3s
#61 [backend stage-1 2/7] RUN apk add --no-cache     ca-certificates     dumb-init     busybox-extras     netcat-openbsd     wget     curl     tzdata     bash     postgresql-client     redis
#61 CACHED
#62 [backend stage-1 3/7] WORKDIR /app
#62 CACHED
#63 [backend stage-1 4/7] COPY --from=builder /app/target/release/viworks-admin-backend /app/app
#63 DONE 0.1s
#64 [backend stage-1 5/7] COPY --from=builder /app/migrations /app/migrations
#64 DONE 0.1s
#65 [backend stage-1 6/7] COPY ops/entrypoint.sh /app/entrypoint.sh
#65 DONE 0.1s
#66 [backend stage-1 7/7] RUN adduser -D -u 10001 appuser &&     chown -R appuser:appuser /app &&     chmod +x /app/entrypoint.sh
#66 DONE 0.3s
#67 [backend] exporting to image
#67 exporting layers
#67 exporting layers 0.2s done
#67 writing image sha256:d765908d6dc1e427d776aabd72e0304669172303cecc779de90b8d6cebc35dcf done
#67 naming to docker.io/library/digitaloceandocker-backend done
#67 DONE 0.2s
#68 [backend] resolving provenance for metadata file
#68 DONE 0.0s
 digitaloceandocker-backend  Built
 digitaloceandocker-frontend  Built
 digitaloceandocker-website  Built
 Container viworks-postgres  Creating
 Container viworks-redis  Creating
 Container viworks-website  Creating
 Container viworks-website  Created
 Container viworks-redis  Created
 Container viworks-postgres  Created
 Container viworks-backend  Creating
 Container viworks-backend  Created
 Container viworks-frontend  Creating
 Container viworks-frontend  Created
 Container viworks-nginx  Creating
 Container viworks-nginx  Created
 Container viworks-website  Starting
 Container viworks-postgres  Starting
 Container viworks-redis  Starting
 Container viworks-redis  Started
 Container viworks-website  Started
 Container viworks-postgres  Started
 Container viworks-postgres  Waiting
 Container viworks-redis  Waiting
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
Run if [ failure == 'success' ]; then
❌ Deployment failed. Check the logs above for details.
🔧 Manual troubleshooting may be required on the server.
🔍 Run './check-backend-status.sh' on the server for diagnostics.
0s
Post job cleanup.
/usr/bin/git version
git version 2.51.0
Temporarily overriding HOME='/home/runner/work/_temp/c2546d93-5026-4371-924c-115838340a46' before making global git config changes
Adding repository directory to the temporary git global config as a safe directory
/usr/bin/git config --global --add safe.directory /home/runner/work/viworkdemo002/viworkdemo002
/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
http.https://github.com/.extraheader
/usr/bin/git config --local --unset-all http.https://github.com/.extraheader
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
