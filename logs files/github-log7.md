deploy
Started 6m 1s ago

1s
1s
1s
2s
0s
5m 40s
Run scp -i ~/.ssh/id_ed25519 deploy.sh ${DROPLET_USER}@${DROPLET_IP}:/tmp/
🚀 Starting ViWorks Automated Deployment...
📅 Deployment started at: Tue Sep  2 07:51:04 UTC 2025
🛑 Stopping all containers gracefully...
 Container viworks-nginx  Stopping
 Container viworks-agent  Stopping
 Container viworks-agent  Stopped
 Container viworks-agent  Removing
 Container viworks-nginx  Stopped
 Container viworks-nginx  Removing
 Container viworks-agent  Removed
 Container viworks-nginx  Removed
 Container viworks-website  Stopping
 Container viworks-frontend  Stopping
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
 Container viworks-redis  Stopped
 Container viworks-redis  Removing
 Container viworks-postgres  Stopped
 Container viworks-postgres  Removing
 Container viworks-redis  Removed
 Container viworks-postgres  Removed
🛑 Force stopping any running containers...
🧹 Removing containers with specific names...
🧹 Removing orphaned containers...
time="2025-09-02T07:51:06Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
🧹 Cleaning up Docker images...
Total reclaimed space: 0B
Deleted Images:
untagged: digitaloceandocker-backend:latest
deleted: sha256:e48fbc3b657cba6cae4eee23d960496857b0e131ee3680c6ed9147c51094554c
untagged: digitaloceandocker-website:latest
deleted: sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a
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
Total reclaimed space: 351MB
🧹 Cleaning up unused networks...
Deleted Networks:
viworks-public
viworks-internal
🔍 Verifying no conflicting containers exist...
🧹 Cleaning up and resetting git repository...
From https://github.com/apebrahimi/viworkdemo002
   6f15b05..1156ebe  main       -> origin/main
HEAD is now at 1156ebe fix(nginx): systematic fix for crash-loop and network issues
🌐 Setting up two-network security architecture...
ca0520ec264199d7e23196d897ae8801ed69c524eff92c10a32cee156a32ccca
254755a3eec957f5c53687043ffb3938d33b8d1116f90815e058749d9eac745d
🔨 Building and starting new containers with two-network security...
 nginx Pulling 
 postgres Pulling 
 redis Pulling 
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
 901a9540064a Waiting 
 6c13c55b4b82 Waiting 
 0f940631c13f Waiting 
 a15854d6fd91 Waiting 
 685be96195b7 Waiting 
 ce414b3fa674 Waiting 
 6afcd9ec0fd9 Waiting 
 9824c27679d3 Already exists 
 6bc572a340ec Pulling fs layer 
 0368fd46e3c6 Pulling fs layer 
 4c55286bbede Pulling fs layer 
 5e28347af205 Pulling fs layer 
 311eca34042e Pulling fs layer 
 0368fd46e3c6 Waiting 
 4c55286bbede Waiting 
 5e28347af205 Waiting 
 e6fe6f07e192 Pulling fs layer 
 a2cadbfeca72 Pulling fs layer 
 4f4fb700ef54 Pulling fs layer 
 a976ed7e7808 Pulling fs layer 
 311eca34042e Waiting 
 e6fe6f07e192 Waiting 
 a2cadbfeca72 Waiting 
 a976ed7e7808 Waiting 
 4f4fb700ef54 Waiting 
 403e3f251637 Pulling fs layer 
 9adfbae99cb7 Pulling fs layer 
 7a8a46741e18 Pulling fs layer 
 c9ebe2ff2d2c Pulling fs layer 
 a992fbc61ecc Pulling fs layer 
 cb1ff4086f82 Pulling fs layer 
 c9ebe2ff2d2c Waiting 
 a992fbc61ecc Waiting 
 cb1ff4086f82 Waiting 
 403e3f251637 Waiting 
 9adfbae99cb7 Waiting 
 7a8a46741e18 Waiting 
 61a7421693bd Downloading [==================================================>]     969B/969B
 61a7421693bd Verifying Checksum 
 61a7421693bd Download complete 
 61a7421693bd Extracting [==================================================>]     969B/969B
 61a7421693bd Extracting [==================================================>]     969B/969B
 a612d38c9b48 Downloading [==================================================>]     175B/175B
 a612d38c9b48 Verifying Checksum 
 a612d38c9b48 Download complete 
 51a939567803 Downloading [>                                                  ]  12.32kB/1.116MB
 51a939567803 Verifying Checksum 
 51a939567803 Download complete 
 61a7421693bd Pull complete 
 51a939567803 Extracting [=>                                                 ]  32.77kB/1.116MB
 51a939567803 Extracting [==================================================>]  1.116MB/1.116MB
 51a939567803 Pull complete 
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 a612d38c9b48 Pull complete 
 901a9540064a Downloading [==================================================>]     116B/116B
 901a9540064a Downloading [==================================================>]     116B/116B
 901a9540064a Download complete 
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Pull complete 
 6c13c55b4b82 Downloading [>                                                  ]  536.6kB/103.9MB
 0f940631c13f Downloading [=====>                                             ]  1.049kB/9.448kB
 0f940631c13f Downloading [==================================================>]  9.448kB/9.448kB
 0f940631c13f Verifying Checksum 
 0f940631c13f Download complete 
 6c13c55b4b82 Downloading [==>                                                ]  4.805MB/103.9MB
 6c13c55b4b82 Downloading [=====>                                             ]  10.66MB/103.9MB
 6c13c55b4b82 Downloading [=======>                                           ]  16.52MB/103.9MB
 a15854d6fd91 Downloading [==================================================>]     129B/129B
 a15854d6fd91 Download complete 
 6c13c55b4b82 Downloading [==========>                                        ]  21.85MB/103.9MB
 685be96195b7 Downloading [==================================================>]     171B/171B
 685be96195b7 Verifying Checksum 
 685be96195b7 Download complete 
 6c13c55b4b82 Downloading [=============>                                     ]  27.19MB/103.9MB
 6c13c55b4b82 Downloading [================>                                  ]   33.6MB/103.9MB
 6c13c55b4b82 Downloading [==================>                                ]  38.38MB/103.9MB
 ce414b3fa674 Downloading [===========>                                       ]  1.369kB/5.927kB
 ce414b3fa674 Downloading [==================================================>]  5.927kB/5.927kB
 ce414b3fa674 Verifying Checksum 
 ce414b3fa674 Download complete 
 6c13c55b4b82 Downloading [=====================>                             ]  44.25MB/103.9MB
 6afcd9ec0fd9 Downloading [==================================================>]     185B/185B
 6afcd9ec0fd9 Download complete 
 6c13c55b4b82 Downloading [========================>                          ]  50.64MB/103.9MB
 6c13c55b4b82 Downloading [===========================>                       ]  57.06MB/103.9MB
 6c13c55b4b82 Downloading [==============================>                    ]  63.99MB/103.9MB
 0368fd46e3c6 Downloading [>                                                  ]  36.48kB/3.638MB
 4c55286bbede Downloading [==================================================>]     950B/950B
 4c55286bbede Verifying Checksum 
 4c55286bbede Download complete 
 0368fd46e3c6 Verifying Checksum 
 0368fd46e3c6 Download complete 
 0368fd46e3c6 Extracting [>                                                  ]  65.54kB/3.638MB
 6c13c55b4b82 Downloading [==================================>                ]  71.47MB/103.9MB
 0368fd46e3c6 Extracting [=============>                                     ]    983kB/3.638MB
 6c13c55b4b82 Downloading [====================================>              ]   76.8MB/103.9MB
 0368fd46e3c6 Extracting [======================================>            ]  2.818MB/3.638MB
 6c13c55b4b82 Downloading [=======================================>           ]  82.15MB/103.9MB
 0368fd46e3c6 Extracting [==================================================>]  3.638MB/3.638MB
 6c13c55b4b82 Downloading [==========================================>        ]  88.52MB/103.9MB
 0368fd46e3c6 Pull complete 
 5e28347af205 Downloading [>                                                  ]  2.738kB/173.2kB
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Extracting [==================================================>]     950B/950B
 5e28347af205 Verifying Checksum 
 5e28347af205 Download complete 
 6c13c55b4b82 Downloading [=============================================>     ]  94.92MB/103.9MB
 311eca34042e Downloading [>                                                  ]  10.63kB/1.003MB
 4c55286bbede Pull complete 
 5e28347af205 Extracting [=========>                                         ]  32.77kB/173.2kB
 311eca34042e Verifying Checksum 
 311eca34042e Download complete 
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 6c13c55b4b82 Downloading [===============================================>   ]  98.66MB/103.9MB
 6c13c55b4b82 Verifying Checksum 
 6c13c55b4b82 Download complete 
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 6c13c55b4b82 Extracting [>                                                  ]  557.1kB/103.9MB
 6c13c55b4b82 Extracting [>                                                  ]  1.671MB/103.9MB
 e6fe6f07e192 Downloading [>                                                  ]    127kB/12.41MB
 6c13c55b4b82 Extracting [=>                                                 ]  2.785MB/103.9MB
 5e28347af205 Pull complete 
 311eca34042e Extracting [=>                                                 ]  32.77kB/1.003MB
 e6fe6f07e192 Downloading [=====================>                             ]  5.358MB/12.41MB
 311eca34042e Extracting [================>                                  ]  327.7kB/1.003MB
 a2cadbfeca72 Downloading [==================================================>]      99B/99B
 a2cadbfeca72 Verifying Checksum 
 a2cadbfeca72 Download complete 
 6c13c55b4b82 Extracting [=>                                                 ]  3.342MB/103.9MB
 e6fe6f07e192 Downloading [====================================>              ]  9.036MB/12.41MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 e6fe6f07e192 Verifying Checksum 
 e6fe6f07e192 Download complete 
 311eca34042e Pull complete 
 4f4fb700ef54 Downloading [==================================================>]      32B/32B
 4f4fb700ef54 Verifying Checksum 
 4f4fb700ef54 Download complete 
 6c13c55b4b82 Extracting [==>                                                ]  4.456MB/103.9MB
 e6fe6f07e192 Extracting [>                                                  ]  131.1kB/12.41MB
 e6fe6f07e192 Extracting [===>                                               ]  917.5kB/12.41MB
 6c13c55b4b82 Extracting [==>                                                ]  5.571MB/103.9MB
 e6fe6f07e192 Extracting [===========>                                       ]  2.753MB/12.41MB
 6c13c55b4b82 Extracting [===>                                               ]  7.242MB/103.9MB
 a976ed7e7808 Downloading [==================================================>]     574B/574B
 a976ed7e7808 Verifying Checksum 
 a976ed7e7808 Download complete 
 e6fe6f07e192 Extracting [=================>                                 ]  4.325MB/12.41MB
 6c13c55b4b82 Extracting [====>                                              ]   9.47MB/103.9MB
 403e3f251637 Downloading [==================================================>]     628B/628B
 403e3f251637 Verifying Checksum 
 403e3f251637 Download complete 
 6bc572a340ec Downloading [>                                                  ]  19.17kB/1.806MB
 e6fe6f07e192 Extracting [==========================>                        ]  6.554MB/12.41MB
 6bc572a340ec Verifying Checksum 
 6bc572a340ec Download complete 
 6bc572a340ec Extracting [>                                                  ]  32.77kB/1.806MB
 6c13c55b4b82 Extracting [=====>                                             ]  11.14MB/103.9MB
 e6fe6f07e192 Extracting [==============================>                    ]  7.602MB/12.41MB
 6bc572a340ec Extracting [==========================>                        ]  950.3kB/1.806MB
 6c13c55b4b82 Extracting [=====>                                             ]  12.26MB/103.9MB
 e6fe6f07e192 Extracting [====================================>              ]  9.044MB/12.41MB
 6bc572a340ec Extracting [==================================================>]  1.806MB/1.806MB
 6c13c55b4b82 Extracting [======>                                            ]  13.93MB/103.9MB
 e6fe6f07e192 Extracting [=========================================>         ]  10.35MB/12.41MB
 9adfbae99cb7 Downloading [==================================================>]     955B/955B
 9adfbae99cb7 Verifying Checksum 
 9adfbae99cb7 Download complete 
 7a8a46741e18 Downloading [==================================================>]     405B/405B
 7a8a46741e18 Verifying Checksum 
 7a8a46741e18 Download complete 
 e6fe6f07e192 Extracting [=============================================>     ]   11.4MB/12.41MB
 6c13c55b4b82 Extracting [=======>                                           ]   15.6MB/103.9MB
 c9ebe2ff2d2c Downloading [===========================================>       ]  1.049kB/1.209kB
 c9ebe2ff2d2c Downloading [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Verifying Checksum 
 c9ebe2ff2d2c Download complete 
 e6fe6f07e192 Extracting [==================================================>]  12.41MB/12.41MB
 6c13c55b4b82 Extracting [========>                                          ]  17.27MB/103.9MB
 6bc572a340ec Pull complete 
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Extracting [==================================================>]     628B/628B
 e6fe6f07e192 Pull complete 
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 403e3f251637 Pull complete 
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 a2cadbfeca72 Pull complete 
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 9adfbae99cb7 Pull complete 
 6c13c55b4b82 Extracting [=========>                                         ]   19.5MB/103.9MB
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 4f4fb700ef54 Pull complete 
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 7a8a46741e18 Pull complete 
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 a992fbc61ecc Downloading [=====================================>             ]  1.049kB/1.398kB
 a992fbc61ecc Downloading [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Verifying Checksum 
 a992fbc61ecc Download complete 
 a976ed7e7808 Pull complete 
 c9ebe2ff2d2c Pull complete 
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 6c13c55b4b82 Extracting [==========>                                        ]  21.73MB/103.9MB
 redis Pulled 
 cb1ff4086f82 Downloading [>                                                  ]  171.9kB/16.84MB
 a992fbc61ecc Pull complete 
 6c13c55b4b82 Extracting [===========>                                       ]  23.95MB/103.9MB
 cb1ff4086f82 Downloading [=========================>                         ]  8.557MB/16.84MB
 cb1ff4086f82 Verifying Checksum 
 cb1ff4086f82 Download complete 
 6c13c55b4b82 Extracting [============>                                      ]  26.18MB/103.9MB
 cb1ff4086f82 Extracting [>                                                  ]  196.6kB/16.84MB
 6c13c55b4b82 Extracting [=============>                                     ]  28.41MB/103.9MB
 cb1ff4086f82 Extracting [===>                                               ]   1.18MB/16.84MB
 6c13c55b4b82 Extracting [==============>                                    ]  30.64MB/103.9MB
 cb1ff4086f82 Extracting [===========>                                       ]  3.736MB/16.84MB
 6c13c55b4b82 Extracting [===============>                                   ]  32.87MB/103.9MB
 cb1ff4086f82 Extracting [================>                                  ]  5.505MB/16.84MB
 cb1ff4086f82 Extracting [=====================>                             ]  7.274MB/16.84MB
 6c13c55b4b82 Extracting [=================>                                 ]  35.65MB/103.9MB
 cb1ff4086f82 Extracting [==========================>                        ]  9.044MB/16.84MB
 6c13c55b4b82 Extracting [==================>                                ]  37.88MB/103.9MB
 cb1ff4086f82 Extracting [================================>                  ]  10.81MB/16.84MB
 6c13c55b4b82 Extracting [===================>                               ]  40.11MB/103.9MB
 cb1ff4086f82 Extracting [=====================================>             ]  12.58MB/16.84MB
 6c13c55b4b82 Extracting [====================>                              ]  42.34MB/103.9MB
 cb1ff4086f82 Extracting [==========================================>        ]  14.35MB/16.84MB
 6c13c55b4b82 Extracting [=====================>                             ]  45.12MB/103.9MB
 cb1ff4086f82 Extracting [===============================================>   ]  16.12MB/16.84MB
 6c13c55b4b82 Extracting [=======================>                           ]  47.91MB/103.9MB
 6c13c55b4b82 Extracting [=======================>                           ]  49.58MB/103.9MB
 cb1ff4086f82 Extracting [==================================================>]  16.84MB/16.84MB
 cb1ff4086f82 Pull complete 
 nginx Pulled 
 6c13c55b4b82 Extracting [========================>                          ]  50.69MB/103.9MB
 6c13c55b4b82 Extracting [=========================>                         ]  52.36MB/103.9MB
 6c13c55b4b82 Extracting [==========================>                        ]  54.59MB/103.9MB
 6c13c55b4b82 Extracting [===========================>                       ]  57.38MB/103.9MB
 6c13c55b4b82 Extracting [=============================>                     ]  61.28MB/103.9MB
 6c13c55b4b82 Extracting [===============================>                   ]  64.62MB/103.9MB
 6c13c55b4b82 Extracting [================================>                  ]  67.96MB/103.9MB
 6c13c55b4b82 Extracting [==================================>                ]   71.3MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.09MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.65MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]   75.2MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]  76.32MB/103.9MB
 6c13c55b4b82 Extracting [=====================================>             ]  78.54MB/103.9MB
 6c13c55b4b82 Extracting [=======================================>           ]  81.33MB/103.9MB
 6c13c55b4b82 Extracting [========================================>          ]  84.12MB/103.9MB
 6c13c55b4b82 Extracting [=========================================>         ]   86.9MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]  90.24MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]  91.36MB/103.9MB
 6c13c55b4b82 Extracting [=============================================>     ]  95.26MB/103.9MB
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
#4 transferring dockerfile: 1.25kB done
#4 DONE 0.0s
#5 [website internal] load metadata for docker.io/library/node:18-alpine
#5 ...
#6 [backend internal] load metadata for docker.io/library/rust:1.89.0-alpine
#6 DONE 0.7s
#5 [website internal] load metadata for docker.io/library/node:18-alpine
#5 DONE 0.8s
#7 [frontend internal] load metadata for docker.io/library/node:22-alpine
#7 DONE 0.8s
#8 [website internal] load .dockerignore
#8 transferring context: 2B done
#8 DONE 0.0s
#9 [backend internal] load metadata for docker.io/library/alpine:3.22
#9 DONE 0.8s
#10 [website base 1/1] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#10 DONE 0.0s
#11 [frontend internal] load .dockerignore
#11 transferring context: 2B 0.0s done
#11 DONE 0.0s
#12 [backend internal] load .dockerignore
#12 transferring context: 2B done
#12 DONE 0.0s
#13 [website internal] load build context
#13 transferring context: 7.37kB done
#13 DONE 0.0s
#14 [website builder 5/5] RUN npm run build
#14 CACHED
#15 [website builder 3/5] COPY . .
#15 CACHED
#16 [website runner 2/8] RUN addgroup --system --gid 1001 nodejs
#16 CACHED
#17 [website runner 7/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#17 CACHED
#18 [website builder 4/5] RUN mkdir -p public
#18 CACHED
#19 [website deps 3/4] COPY package.json pnpm-lock.yaml* ./
#19 CACHED
#20 [website builder 1/5] WORKDIR /app
#20 CACHED
#21 [website builder 2/5] COPY --from=deps /app/node_modules ./node_modules
#21 CACHED
#22 [website runner 6/8] RUN chown nextjs:nodejs .next
#22 CACHED
#23 [website runner 4/8] COPY --from=builder /app/public ./public
#23 CACHED
#24 [website runner 5/8] RUN mkdir .next
#24 CACHED
#25 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#25 CACHED
#26 [website deps 1/4] RUN apk add --no-cache libc6-compat
#26 CACHED
#27 [website deps 2/4] WORKDIR /app
#27 CACHED
#28 [website runner 3/8] RUN adduser --system --uid 1001 nextjs
#28 CACHED
#29 [website runner 8/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#29 CACHED
#30 [backend builder  1/11] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#30 DONE 0.0s
#31 [backend stage-1 1/7] FROM docker.io/library/alpine:3.22@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#31 DONE 0.0s
#32 [frontend builder 1/6] FROM docker.io/library/node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9
#32 DONE 0.0s
#33 [backend internal] load build context
#33 transferring context: 1.69kB 0.0s done
#33 DONE 0.0s
#34 [website] exporting to image
#34 exporting layers done
#34 writing image sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a 0.0s done
#34 naming to docker.io/library/digitaloceandocker-website 0.0s done
#34 DONE 0.0s
#35 [frontend internal] load build context
#35 transferring context: 5.42kB 0.0s done
#35 DONE 0.1s
#36 [frontend runner 2/7] RUN apk add --no-cache dumb-init
#36 CACHED
#37 [frontend runner 6/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#37 CACHED
#38 [frontend runner 4/7] WORKDIR /app
#38 CACHED
#39 [frontend runner 5/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#39 CACHED
#40 [frontend runner 3/7] RUN addgroup -g 1001 -S nodejs &&     adduser -u 1001 -S nextjs -G nodejs
#40 CACHED
#41 [frontend builder 3/6] COPY package*.json ./
#41 CACHED
#42 [frontend builder 4/6] RUN npm install
#42 CACHED
#43 [frontend builder 6/6] RUN npm run build
#43 CACHED
#44 [frontend builder 2/6] WORKDIR /app
#44 CACHED
#45 [frontend builder 5/6] COPY . .
#45 CACHED
#46 [frontend runner 7/7] RUN mkdir -p ./public
#46 CACHED
#47 [backend stage-1 4/7] COPY --from=builder /app/target/release/viworks-admin-backend /app/app
#47 CACHED
#48 [backend builder  4/11] RUN rustup target add x86_64-unknown-linux-musl
#48 CACHED
#49 [backend builder  9/11] COPY src ./src
#49 CACHED
#50 [backend stage-1 6/7] COPY ops/entrypoint.sh /app/entrypoint.sh
#50 CACHED
#51 [backend stage-1 5/7] COPY --from=builder /app/migrations /app/migrations
#51 CACHED
#52 [backend builder  7/11] RUN cargo build --release
#52 CACHED
#53 [backend stage-1 3/7] WORKDIR /app
#53 CACHED
#54 [backend builder  8/11] RUN rm src/main.rs
#54 CACHED
#55 [backend builder  6/11] RUN mkdir src && echo "fn main() {}" > src/main.rs
#55 CACHED
#56 [backend builder  3/11] RUN apk add --no-cache     pkgconfig     openssl-dev     postgresql-dev     musl-dev     gcc     curl
#56 CACHED
#57 [backend builder  5/11] COPY Cargo.toml Cargo.lock* ./
#57 CACHED
#58 [backend stage-1 2/7] RUN apk add --no-cache     ca-certificates     dumb-init     busybox-extras     netcat-openbsd     wget     curl     tzdata     bash     postgresql-client     redis
#58 CACHED
#59 [backend builder 10/11] COPY migrations ./migrations
#59 CACHED
#60 [backend builder 11/11] RUN cargo build --release
#60 CACHED
#61 [backend builder  2/11] WORKDIR /app
#61 CACHED
#62 [backend stage-1 7/7] RUN adduser -D -u 10001 appuser &&     chown -R appuser:appuser /app &&     chmod +x /app/entrypoint.sh
#62 CACHED
#63 [backend] exporting to image
#63 exporting layers done
#63 writing image sha256:e48fbc3b657cba6cae4eee23d960496857b0e131ee3680c6ed9147c51094554c done
#63 naming to docker.io/library/digitaloceandocker-backend done
#63 DONE 0.0s
#64 [frontend] exporting to image
#64 exporting layers done
#64 writing image sha256:5df242396420b99f980135e561ed081c939e3a76f937599d1f50f5dd9ca28d95 done
#64 naming to docker.io/library/digitaloceandocker-frontend done
#64 DONE 0.0s
#65 [website] resolving provenance for metadata file
#65 DONE 0.1s
#66 [backend] resolving provenance for metadata file
#66 DONE 0.0s
#67 [frontend] resolving provenance for metadata file
#67 DONE 0.0s
 digitaloceandocker-website  Built
 digitaloceandocker-backend  Built
 digitaloceandocker-frontend  Built
 Container viworks-website  Creating
 Container viworks-redis  Creating
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
 Container viworks-redis  Starting
 Container viworks-website  Starting
 Container viworks-postgres  Starting
 Container viworks-postgres  Started
 Container viworks-website  Started
 Container viworks-redis  Started
 Container viworks-postgres  Waiting
 Container viworks-redis  Waiting
 Container viworks-postgres  Healthy
 Container viworks-redis  Healthy
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
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
curl: (7) Failed to connect to localhost port 8081 after 0 ms: Connection refused
❌ Backend health check failed
📊 Checking resource usage...
No viworks containers found
📋 Recent logs (last 20 lines each):
Backend logs:
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:174: ERROR:  trigger "update_policies_updated_at" for relation "policies" already exists
viworks-backend  | psql:/app/migrations/001_initial_schema.sql:184: ERROR:  duplicate key value violates unique constraint "users_username_key"
viworks-backend  | DETAIL:  Key (username)=(admin) already exists.
viworks-backend  | INSERT 0 1
viworks-backend  | 2025-09-02 07:51:26. | ✅ Migration 001_initial_schema.sql completed successfully
viworks-backend  | 2025-09-02 07:51:26. | ✅ All database migrations completed successfully
viworks-backend  | 2025-09-02 07:51:26. | 🚀 Launching application...
viworks-backend  | 2025-09-02 07:51:26. | 📊 Binary size: 5.8M
viworks-backend  | 2025-09-02 07:51:26. | 📊 Binary permissions: -rwxr-xr-x    1 appuser  appuser    6025576 Sep  2 06:46 /app/app
viworks-backend  | 🚀 Starting ViWorkS Admin Backend (Minimal)...
viworks-backend  | 🔧 Environment Configuration:
viworks-backend  |   HOST: 0.0.0.0
viworks-backend  |   PORT: 8081
viworks-backend  |   RUST_LOG: info
viworks-backend  | 🌐 Starting HTTP server on 0.0.0.0:8081...
viworks-backend  | ✅ HTTP server bound successfully
viworks-backend  | 🚀 Server is now running and accepting connections
viworks-backend  | [2025-09-02T07:51:26Z INFO  actix_server::builder] starting 2 workers
viworks-backend  | [2025-09-02T07:51:26Z INFO  actix_server::server] Actix runtime found; starting in Actix runtime
viworks-backend  | [2025-09-02T07:51:26Z INFO  actix_server::server] starting service: "actix-web-service-0.0.0.0:8081", workers: 2, listening on: 0.0.0.0:8081
PostgreSQL logs:
viworks-postgres  | 2025-09-02 07:51:26.874 UTC [43] ERROR:  relation "idx_otp_challenges_user_id" already exists
viworks-postgres  | 2025-09-02 07:51:26.874 UTC [43] STATEMENT:  CREATE INDEX idx_otp_challenges_user_id ON otp_challenges(user_id);
viworks-postgres  | 2025-09-02 07:51:26.874 UTC [43] ERROR:  relation "idx_otp_challenges_expires_at" already exists
viworks-postgres  | 2025-09-02 07:51:26.874 UTC [43] STATEMENT:  CREATE INDEX idx_otp_challenges_expires_at ON otp_challenges(expires_at);
viworks-postgres  | 2025-09-02 07:51:26.879 UTC [43] ERROR:  trigger "update_users_updated_at" for relation "users" already exists
viworks-postgres  | 2025-09-02 07:51:26.879 UTC [43] STATEMENT:  CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
viworks-postgres  | 2025-09-02 07:51:26.880 UTC [43] ERROR:  trigger "update_policies_updated_at" for relation "policies" already exists
viworks-postgres  | 2025-09-02 07:51:26.880 UTC [43] STATEMENT:  CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
viworks-postgres  | 2025-09-02 07:51:26.883 UTC [43] ERROR:  duplicate key value violates unique constraint "users_username_key"
viworks-postgres  | 2025-09-02 07:51:26.883 UTC [43] DETAIL:  Key (username)=(admin) already exists.
viworks-postgres  | 2025-09-02 07:51:26.883 UTC [43] STATEMENT:  INSERT INTO users (username, email, password_hash, mobile, status, roles) VALUES (
viworks-postgres  | 	    'admin',
viworks-postgres  | 	    'admin@viworks.com',
viworks-postgres  | 	    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5u.Ge', -- admin123
viworks-postgres  | 	    '09123456789',
viworks-postgres  | 	    'active',
viworks-postgres  | 	    '["admin"]'
viworks-postgres  | 	);
viworks-postgres  | 2025-09-02 07:56:21.126 UTC [27] LOG:  checkpoint starting: time
viworks-postgres  | 2025-09-02 07:56:21.958 UTC [27] LOG:  checkpoint complete: wrote 11 buffers (0.1%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.809 s, sync=0.004 s, total=0.832 s; sync files=10, longest=0.002 s, average=0.001 s; distance=38 kB, estimate=38 kB
Redis logs:
viworks-redis  | 1:C 02 Sep 2025 07:51:21.044 # WARNING Memory overcommit must be enabled! Without it, a background save or replication may fail under low memory condition. Being disabled, it can also cause failures without low memory condition, see https://github.com/jemalloc/jemalloc/issues/1328. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
viworks-redis  | 1:C 02 Sep 2025 07:51:21.044 * oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
viworks-redis  | 1:C 02 Sep 2025 07:51:21.044 * Redis version=7.4.5, bits=64, commit=00000000, modified=0, pid=1, just started
viworks-redis  | 1:C 02 Sep 2025 07:51:21.044 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
viworks-redis  | 1:M 02 Sep 2025 07:51:21.045 * monotonic clock: POSIX clock_gettime
viworks-redis  | 1:M 02 Sep 2025 07:51:21.047 * Running mode=standalone, port=6379.
viworks-redis  | 1:M 02 Sep 2025 07:51:21.047 * Server initialized
viworks-redis  | 1:M 02 Sep 2025 07:51:21.048 * Loading RDB produced by version 7.4.5
viworks-redis  | 1:M 02 Sep 2025 07:51:21.048 * RDB age 16 seconds
viworks-redis  | 1:M 02 Sep 2025 07:51:21.048 * RDB memory usage when created 0.93 Mb
viworks-redis  | 1:M 02 Sep 2025 07:51:21.048 * Done loading RDB, keys loaded: 0, keys expired: 0.
viworks-redis  | 1:M 02 Sep 2025 07:51:21.048 * DB loaded from disk: 0.000 seconds
viworks-redis  | 1:M 02 Sep 2025 07:51:21.048 * Ready to accept connections tcp
✅ Deployment completed successfully!
📅 Deployment completed at: Tue Sep  2 07:56:41 UTC 2025
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
viworks-backend    digitaloceandocker-backend    "/usr/bin/dumb-init …"   backend    5 minutes ago   Up 5 minutes (healthy)          
viworks-frontend   digitaloceandocker-frontend   "dumb-init -- node s…"   frontend   5 minutes ago   Up 5 minutes (unhealthy)        
viworks-nginx      nginx:alpine                  "/docker-entrypoint.…"   nginx      5 minutes ago   Restarting (1) 20 seconds ago   
viworks-postgres   postgres:15-alpine            "docker-entrypoint.s…"   postgres   5 minutes ago   Up 5 minutes (healthy)          
viworks-redis      redis:7-alpine                "docker-entrypoint.s…"   redis      5 minutes ago   Up 5 minutes (healthy)          
viworks-website    digitaloceandocker-website    "docker-entrypoint.s…"   website    5 minutes ago   Up 5 minutes (unhealthy)        
16s
Run echo "🔍 Verifying deployment..."
🔍 Verifying deployment...
