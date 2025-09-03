deploy
Started 9m 10s ago

0s
2s
2s
3s
0s
2m 12s
Run scp -i ~/.ssh/id_ed25519 deploy.sh ${DROPLET_USER}@${DROPLET_IP}:/tmp/
🚀 Starting ViWorks Automated Deployment...
📅 Deployment started at: Tue Sep  2 19:14:29 UTC 2025
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
time="2025-09-02T19:14:30Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
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
untagged: digitaloceandocker-frontend:latest
deleted: sha256:df2cf8a866a5befb875fe291eb18a8b6f2259ac2f55c7339cfbb6998df3cccda
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
untagged: digitaloceandocker-backend:latest
deleted: sha256:676719744fa999f1783137f35f989f7eac894f1e93e88cdb3c7c35e7e27a0957
untagged: digitaloceandocker-website:latest
deleted: sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a
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
viworks-internal
viworks-public

🔍 Verifying no conflicting containers exist...
🧹 Cleaning up and resetting git repository...
From https://github.com/apebrahimi/viworkdemo002
   024736f..e0e48a3  main       -> origin/main
HEAD is now at e0e48a3 fix: Resolve backend startup issues - fix environment variables, simplify health check, and improve startup timing
🌐 Setting up two-network security architecture...
ef5be1e28b9f7798a48fb43ea13f3b183a9471befc12d4994256cdc768ed0972
0ac6cabf2d8ff9b7d8f99052bbc5e80d60b6fbca1cd365510f6c5378c8e18160
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
 9824c27679d3 Already exists 
 6bc572a340ec Pulling fs layer 
 403e3f251637 Pulling fs layer 
 9adfbae99cb7 Pulling fs layer 
 7a8a46741e18 Pulling fs layer 
 c9ebe2ff2d2c Pulling fs layer 
 a992fbc61ecc Pulling fs layer 
 cb1ff4086f82 Pulling fs layer 
 9adfbae99cb7 Waiting 
 7a8a46741e18 Waiting 
 c9ebe2ff2d2c Waiting 
 a992fbc61ecc Waiting 
 cb1ff4086f82 Waiting 
 6bc572a340ec Waiting 
 403e3f251637 Waiting 
 5e28347af205 Downloading [>                                                  ]  2.738kB/173.2kB
 4c55286bbede Downloading [==================================================>]     950B/950B
 4c55286bbede Verifying Checksum 
 4c55286bbede Download complete 
 5e28347af205 Download complete 
 0368fd46e3c6 Downloading [>                                                  ]  36.88kB/3.638MB
 0368fd46e3c6 Downloading [=================================================> ]  3.568MB/3.638MB
 0368fd46e3c6 Verifying Checksum 
 0368fd46e3c6 Download complete 
 0368fd46e3c6 Extracting [>                                                  ]  65.54kB/3.638MB
 0368fd46e3c6 Extracting [======================>                            ]  1.638MB/3.638MB
 0368fd46e3c6 Extracting [==================================================>]  3.638MB/3.638MB
 311eca34042e Downloading [>                                                  ]  10.63kB/1.003MB
 e6fe6f07e192 Downloading [>                                                  ]  127.5kB/12.41MB
 0368fd46e3c6 Pull complete 
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Extracting [==================================================>]     950B/950B
 311eca34042e Verifying Checksum 
 311eca34042e Download complete 
 4c55286bbede Pull complete 
 5e28347af205 Extracting [=========>                                         ]  32.77kB/173.2kB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 e6fe6f07e192 Downloading [=================================>                 ]  8.323MB/12.41MB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 e6fe6f07e192 Downloading [============================================>      ]   11.1MB/12.41MB
 5e28347af205 Pull complete 
 e6fe6f07e192 Verifying Checksum 
 e6fe6f07e192 Download complete 
 311eca34042e Extracting [=>                                                 ]  32.77kB/1.003MB
 a2cadbfeca72 Downloading [==================================================>]      99B/99B
 a2cadbfeca72 Verifying Checksum 
 a2cadbfeca72 Download complete 
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 311eca34042e Pull complete 
 e6fe6f07e192 Extracting [>                                                  ]  131.1kB/12.41MB
 e6fe6f07e192 Extracting [=============>                                     ]  3.277MB/12.41MB
 4f4fb700ef54 Downloading [==================================================>]      32B/32B
 4f4fb700ef54 Verifying Checksum 
 4f4fb700ef54 Download complete 
 e6fe6f07e192 Extracting [=========================>                         ]  6.423MB/12.41MB
 e6fe6f07e192 Extracting [=========================================>         ]  10.22MB/12.41MB
 a976ed7e7808 Downloading [==================================================>]     574B/574B
 a976ed7e7808 Download complete 
 e6fe6f07e192 Extracting [==================================================>]  12.41MB/12.41MB
 61a7421693bd Downloading [==================================================>]     969B/969B
 61a7421693bd Verifying Checksum 
 61a7421693bd Download complete 
 61a7421693bd Extracting [==================================================>]     969B/969B
 61a7421693bd Extracting [==================================================>]     969B/969B
 e6fe6f07e192 Pull complete 
 61a7421693bd Pull complete 
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
 51a939567803 Downloading [>                                                  ]  12.32kB/1.116MB
 51a939567803 Verifying Checksum 
 51a939567803 Download complete 
 51a939567803 Extracting [=>                                                 ]  32.77kB/1.116MB
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
 901a9540064a Download complete 
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Pull complete 
 6c13c55b4b82 Downloading [>                                                  ]  540.3kB/103.9MB
 0f940631c13f Downloading [=====>                                             ]  1.049kB/9.448kB
 0f940631c13f Download complete 
 6c13c55b4b82 Downloading [===>                                               ]  6.947MB/103.9MB
 a15854d6fd91 Downloading [==================================================>]     129B/129B
 a15854d6fd91 Verifying Checksum 
 a15854d6fd91 Download complete 
 6c13c55b4b82 Downloading [======>                                            ]  12.81MB/103.9MB
 6c13c55b4b82 Downloading [========>                                          ]   17.6MB/103.9MB
 6c13c55b4b82 Downloading [============>                                      ]  25.59MB/103.9MB
 685be96195b7 Downloading [==================================================>]     171B/171B
 685be96195b7 Verifying Checksum 
 685be96195b7 Download complete 
 6c13c55b4b82 Downloading [===============>                                   ]  32.01MB/103.9MB
 6c13c55b4b82 Downloading [=================>                                 ]  36.28MB/103.9MB
 ce414b3fa674 Downloading [========>                                          ]  1.049kB/5.927kB
 ce414b3fa674 Downloading [==================================================>]  5.927kB/5.927kB
 ce414b3fa674 Verifying Checksum 
 ce414b3fa674 Download complete 
 6c13c55b4b82 Downloading [===================>                               ]  40.55MB/103.9MB
 6c13c55b4b82 Downloading [======================>                            ]  47.53MB/103.9MB
 6afcd9ec0fd9 Downloading [==================================================>]     185B/185B
 6afcd9ec0fd9 Verifying Checksum 
 6afcd9ec0fd9 Download complete 
 6c13c55b4b82 Downloading [=======================>                           ]  49.13MB/103.9MB
 6bc572a340ec Downloading [>                                                  ]  18.84kB/1.806MB
 6bc572a340ec Downloading [==================================================>]  1.806MB/1.806MB
 6bc572a340ec Verifying Checksum 
 6bc572a340ec Download complete 
 6bc572a340ec Extracting [>                                                  ]  32.77kB/1.806MB
 6c13c55b4b82 Downloading [=========================>                         ]  53.41MB/103.9MB
 6c13c55b4b82 Downloading [============================>                      ]  58.22MB/103.9MB
 6bc572a340ec Extracting [==================================================>]  1.806MB/1.806MB
 6c13c55b4b82 Downloading [==============================>                    ]  63.03MB/103.9MB
 6bc572a340ec Pull complete 
 6c13c55b4b82 Downloading [=================================>                 ]  69.46MB/103.9MB
 403e3f251637 Downloading [==================================================>]     628B/628B
 403e3f251637 Verifying Checksum 
 403e3f251637 Download complete 
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Pull complete 
 6c13c55b4b82 Downloading [=====================================>             ]  76.95MB/103.9MB
 6c13c55b4b82 Downloading [=========================================>         ]  86.04MB/103.9MB
 9adfbae99cb7 Downloading [==================================================>]     955B/955B
 9adfbae99cb7 Verifying Checksum 
 9adfbae99cb7 Download complete 
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Pull complete 
 6c13c55b4b82 Downloading [============================================>      ]  92.98MB/103.9MB
 6c13c55b4b82 Downloading [================================================>  ]  101.5MB/103.9MB
 6c13c55b4b82 Verifying Checksum 
 6c13c55b4b82 Download complete 
 6c13c55b4b82 Extracting [>                                                  ]  557.1kB/103.9MB
 7a8a46741e18 Downloading [==================================================>]     405B/405B
 7a8a46741e18 Verifying Checksum 
 7a8a46741e18 Download complete 
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 7a8a46741e18 Pull complete 
 6c13c55b4b82 Extracting [>                                                  ]  1.114MB/103.9MB
 c9ebe2ff2d2c Downloading [===========================================>       ]  1.049kB/1.209kB
 c9ebe2ff2d2c Downloading [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Verifying Checksum 
 c9ebe2ff2d2c Download complete 
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Pull complete 
 6c13c55b4b82 Extracting [=>                                                 ]  3.342MB/103.9MB
 6c13c55b4b82 Extracting [===>                                               ]  6.685MB/103.9MB
 6c13c55b4b82 Extracting [====>                                              ]  10.03MB/103.9MB
 cb1ff4086f82 Downloading [>                                                  ]  172.3kB/16.84MB
 a992fbc61ecc Downloading [================================================>  ]  1.369kB/1.398kB
 a992fbc61ecc Downloading [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Verifying Checksum 
 a992fbc61ecc Download complete 
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Pull complete 
 6c13c55b4b82 Extracting [======>                                            ]  12.81MB/103.9MB
 cb1ff4086f82 Downloading [==============>                                    ]   4.85MB/16.84MB
 6c13c55b4b82 Extracting [========>                                          ]  16.71MB/103.9MB
 cb1ff4086f82 Downloading [====================>                              ]  6.832MB/16.84MB
 6c13c55b4b82 Extracting [=========>                                         ]   19.5MB/103.9MB
 cb1ff4086f82 Downloading [==================================>                ]  11.67MB/16.84MB
 6c13c55b4b82 Extracting [==========>                                        ]  22.28MB/103.9MB
 cb1ff4086f82 Downloading [=================================================> ]  16.66MB/16.84MB
 cb1ff4086f82 Verifying Checksum 
 cb1ff4086f82 Download complete 
 cb1ff4086f82 Extracting [>                                                  ]  196.6kB/16.84MB
 6c13c55b4b82 Extracting [===========>                                       ]  24.51MB/103.9MB
 cb1ff4086f82 Extracting [==>                                                ]    983kB/16.84MB
 6c13c55b4b82 Extracting [============>                                      ]  26.18MB/103.9MB
 cb1ff4086f82 Extracting [=========>                                         ]  3.342MB/16.84MB
 6c13c55b4b82 Extracting [=============>                                     ]  27.85MB/103.9MB
 cb1ff4086f82 Extracting [==============>                                    ]  4.719MB/16.84MB
 6c13c55b4b82 Extracting [==============>                                    ]  30.64MB/103.9MB
 cb1ff4086f82 Extracting [=====================>                             ]  7.078MB/16.84MB
 6c13c55b4b82 Extracting [===============>                                   ]  32.87MB/103.9MB
 cb1ff4086f82 Extracting [===========================>                       ]  9.241MB/16.84MB
 6c13c55b4b82 Extracting [================>                                  ]  35.09MB/103.9MB
 cb1ff4086f82 Extracting [=================================>                 ]   11.4MB/16.84MB
 6c13c55b4b82 Extracting [=================>                                 ]  37.32MB/103.9MB
 cb1ff4086f82 Extracting [=======================================>           ]  13.37MB/16.84MB
 6c13c55b4b82 Extracting [===================>                               ]  40.11MB/103.9MB
 cb1ff4086f82 Extracting [============================================>      ]  15.14MB/16.84MB
 6c13c55b4b82 Extracting [====================>                              ]  42.89MB/103.9MB
 6c13c55b4b82 Extracting [=====================>                             ]  45.12MB/103.9MB
 cb1ff4086f82 Extracting [==================================================>]  16.84MB/16.84MB
 6c13c55b4b82 Extracting [======================>                            ]  47.35MB/103.9MB
 cb1ff4086f82 Pull complete 
 6c13c55b4b82 Extracting [=======================>                           ]  49.02MB/103.9MB
 nginx Pulled 
 6c13c55b4b82 Extracting [========================>                          ]  50.69MB/103.9MB
 6c13c55b4b82 Extracting [=========================>                         ]  52.36MB/103.9MB
 6c13c55b4b82 Extracting [==========================>                        ]  54.59MB/103.9MB
 6c13c55b4b82 Extracting [===========================>                       ]  57.38MB/103.9MB
 6c13c55b4b82 Extracting [=============================>                     ]  60.72MB/103.9MB
 6c13c55b4b82 Extracting [==============================>                    ]   63.5MB/103.9MB
 6c13c55b4b82 Extracting [================================>                  ]  66.85MB/103.9MB
 6c13c55b4b82 Extracting [=================================>                 ]  69.63MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.65MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]   75.2MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]  76.87MB/103.9MB
 6c13c55b4b82 Extracting [=====================================>             ]  78.54MB/103.9MB
 6c13c55b4b82 Extracting [=======================================>           ]  81.33MB/103.9MB
 6c13c55b4b82 Extracting [========================================>          ]  84.12MB/103.9MB
 6c13c55b4b82 Extracting [=========================================>         ]   86.9MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]  90.24MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]  91.36MB/103.9MB
 6c13c55b4b82 Extracting [=============================================>     ]   94.7MB/103.9MB
 6c13c55b4b82 Extracting [===============================================>   ]   98.6MB/103.9MB
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

#2 [website internal] load build definition from Dockerfile
#2 transferring dockerfile: 2.04kB done
#2 DONE 0.0s

#3 [frontend internal] load build definition from Dockerfile
#3 transferring dockerfile: 1.58kB done
#3 DONE 0.0s

#4 [backend internal] load build definition from Dockerfile.fixed
#4 transferring dockerfile: 1.87kB done
#4 WARN: FromAsCasing: 'as' and 'FROM' keywords' casing do not match (line 2)
#4 DONE 0.0s

#5 [backend internal] load metadata for docker.io/library/rust:1.89.0-alpine
#5 ...

#6 [backend internal] load metadata for docker.io/library/alpine:3.22
#6 DONE 0.7s

#5 [backend internal] load metadata for docker.io/library/rust:1.89.0-alpine
#5 DONE 0.8s

#7 [backend internal] load .dockerignore
#7 transferring context: 2B done
#7 DONE 0.0s

#8 [website internal] load metadata for docker.io/library/node:18-alpine
#8 DONE 0.8s

#9 [website internal] load .dockerignore
#9 transferring context: 2B 0.0s done
#9 DONE 0.0s

#10 [frontend internal] load metadata for docker.io/library/node:22-alpine
#10 DONE 0.8s

#11 [backend stage-1 1/7] FROM docker.io/library/alpine:3.22@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#11 DONE 0.0s

#12 [backend builder  1/11] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 DONE 0.0s

#13 [website base 1/1] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#13 DONE 0.0s

#14 [frontend internal] load .dockerignore
#14 transferring context: 2B 0.0s done
#14 DONE 0.0s

#15 [backend internal] load build context
#15 transferring context: 1.69kB 0.0s done
#15 DONE 0.0s

#16 [backend stage-1 2/7] RUN apk add --no-cache     ca-certificates     dumb-init     busybox-extras     netcat-openbsd     wget     curl     tzdata     bash     postgresql-client     redis
#16 CACHED

#17 [backend stage-1 3/7] WORKDIR /app
#17 CACHED

#18 [backend stage-1 5/7] COPY --from=builder /app/migrations /app/migrations
#18 CACHED

#19 [backend builder  2/11] WORKDIR /app
#19 CACHED

#20 [backend builder 10/11] COPY migrations ./migrations
#20 CACHED

#21 [backend builder  9/11] COPY src ./src
#21 CACHED

#22 [backend builder  8/11] RUN rm src/main.rs
#22 CACHED

#23 [backend builder 11/11] RUN cargo build --release
#23 CACHED

#24 [backend builder  7/11] RUN cargo build --release
#24 CACHED

#25 [backend stage-1 6/7] COPY ops/entrypoint.sh /app/entrypoint.sh
#25 CACHED

#26 [backend stage-1 4/7] COPY --from=builder /app/target/release/viworks-admin-backend /app/app
#26 CACHED

#27 [backend builder  3/11] RUN apk add --no-cache     pkgconfig     openssl-dev     postgresql-dev     musl-dev     gcc     curl
#27 CACHED

#28 [backend builder  6/11] RUN mkdir src && echo "fn main() {}" > src/main.rs
#28 CACHED

#29 [backend builder  5/11] COPY Cargo.toml Cargo.lock* ./
#29 CACHED

#30 [backend builder  4/11] RUN rustup target add x86_64-unknown-linux-musl
#30 CACHED

#31 [website internal] load build context
#31 transferring context: 7.37kB 0.0s done
#31 DONE 0.0s

#32 [backend stage-1 7/7] RUN adduser -D -u 10001 appuser &&     chown -R appuser:appuser /app &&     chmod +x /app/entrypoint.sh
#32 CACHED

#33 [frontend builder 1/7] FROM docker.io/library/node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9
#33 DONE 0.0s

#34 [backend] exporting to image
#34 exporting layers done
#34 writing image sha256:676719744fa999f1783137f35f989f7eac894f1e93e88cdb3c7c35e7e27a0957 done
#34 naming to docker.io/library/digitaloceandocker-backend done
#34 DONE 0.0s

#35 [website runner 4/8] COPY --from=builder /app/public ./public
#35 CACHED

#36 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#36 CACHED

#37 [website deps 1/4] RUN apk add --no-cache libc6-compat
#37 CACHED

#38 [website builder 2/5] COPY --from=deps /app/node_modules ./node_modules
#38 CACHED

#39 [website runner 6/8] RUN chown nextjs:nodejs .next
#39 CACHED

#40 [website runner 7/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#40 CACHED

#41 [website builder 3/5] COPY . .
#41 CACHED

#42 [website deps 2/4] WORKDIR /app
#42 CACHED

#43 [website builder 1/5] WORKDIR /app
#43 CACHED

#44 [website builder 4/5] RUN mkdir -p public
#44 CACHED

#45 [website runner 5/8] RUN mkdir .next
#45 CACHED

#46 [website runner 2/8] RUN addgroup --system --gid 1001 nodejs
#46 CACHED

#47 [website deps 3/4] COPY package.json pnpm-lock.yaml* ./
#47 CACHED

#48 [website builder 5/5] RUN npm run build
#48 CACHED

#49 [website runner 3/8] RUN adduser --system --uid 1001 nextjs
#49 CACHED

#50 [website runner 8/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#50 CACHED

#51 [frontend internal] load build context
#51 transferring context: 5.92kB 0.0s done
#51 DONE 0.0s

#52 [frontend builder 3/7] RUN apk add --no-cache python3 make g++
#52 CACHED

#53 [frontend runner 3/7] RUN addgroup -g 1001 -S nodejs &&     adduser -u 1001 -S nextjs -G nodejs
#53 CACHED

#54 [frontend builder 7/7] RUN echo "Starting build process..." &&     npm run build &&     echo "Build completed. Checking standalone output..." &&     ls -la .next/ &&     ls -la .next/standalone/ || echo "Standalone directory not found!" &&     echo "Build verification complete."
#54 CACHED

#55 [frontend builder 6/7] COPY . .
#55 CACHED

#56 [frontend runner 5/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#56 CACHED

#57 [frontend builder 2/7] WORKDIR /app
#57 CACHED

#58 [frontend runner 4/7] WORKDIR /app
#58 CACHED

#59 [frontend runner 2/7] RUN apk add --no-cache dumb-init
#59 CACHED

#60 [frontend runner 6/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#60 CACHED

#61 [frontend builder 4/7] COPY package*.json ./
#61 CACHED

#62 [frontend builder 5/7] RUN npm install
#62 CACHED

#63 [frontend runner 7/7] RUN mkdir -p ./public
#63 CACHED

#64 [website] exporting to image
#64 exporting layers done
#64 writing image sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a done
#64 naming to docker.io/library/digitaloceandocker-website done
#64 DONE 0.0s

#65 [frontend] exporting to image
#65 exporting layers done
#65 writing image sha256:df2cf8a866a5befb875fe291eb18a8b6f2259ac2f55c7339cfbb6998df3cccda done
#65 naming to docker.io/library/digitaloceandocker-frontend done
#65 DONE 0.0s

#66 [backend] resolving provenance for metadata file
 digitaloceandocker-backend  Built
#66 DONE 0.0s
 digitaloceandocker-frontend  Built
 digitaloceandocker-website  Built

#67 [website] resolving provenance for metadata file
#67 DONE 0.0s

#68 [frontend] resolving provenance for metadata file
#68 DONE 0.0s
 Container viworks-website  Creating
 Container viworks-postgres  Creating
 Container viworks-redis  Creating
 Container viworks-website  Created
 Container viworks-redis  Created
 Container viworks-postgres  Created
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
 Container viworks-postgres  Started
 Container viworks-redis  Waiting
 Container viworks-postgres  Waiting
 Container viworks-website  Started
 Container viworks-postgres  Healthy
 Container viworks-redis  Healthy
 Container viworks-backend  Starting
 Container viworks-backend  Started
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
✅ nginx is healthy
📊 Checking service status...
NAME               IMAGE                         COMMAND                  SERVICE    CREATED         STATUS                                  PORTS
viworks-backend    digitaloceandocker-backend    "/usr/bin/dumb-init …"   backend    8 seconds ago   Restarting (0) Less than a second ago   
viworks-frontend   digitaloceandocker-frontend   "dumb-init -- node s…"   frontend   8 seconds ago   Up 2 seconds (health: starting)         
viworks-nginx      nginx:alpine                  "/docker-entrypoint.…"   nginx      8 seconds ago   Up 1 second (health: starting)          0.0.0.0:80->80/tcp, [::]:80->80/tcp, 0.0.0.0:443->443/tcp, [::]:443->443/tcp
viworks-postgres   postgres:15-alpine            "docker-entrypoint.s…"   postgres   9 seconds ago   Up 8 seconds (healthy)                  
viworks-redis      redis:7-alpine                "docker-entrypoint.s…"   redis      9 seconds ago   Up 8 seconds (healthy)                  
viworks-website    digitaloceandocker-website    "docker-entrypoint.s…"   website    9 seconds ago   Up 8 seconds (healthy)                  
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
✅ Nginx proxy is responding
🔍 Running backend-specific tests...
Testing database connection...
Error response from daemon: Container 4faa3af49fa4a54eec76e9acceb3b0501b42a29f5127a087fd201c3053f69b1c is restarting, wait until the container is running
❌ Database connection failed
Testing Redis connection...
Error response from daemon: Container 4faa3af49fa4a54eec76e9acceb3b0501b42a29f5127a087fd201c3053f69b1c is restarting, wait until the container is running
❌ Redis connection failed
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
viworks-backend  | 2025-09-02 19:15:46. | ✅ Migration 001_initial_schema.sql completed successfully
viworks-backend  | 2025-09-02 19:15:46. | ✅ All database migrations completed successfully
viworks-backend  | 2025-09-02 19:15:46. | 🚀 Launching application...
viworks-backend  | 2025-09-02 19:15:46. | 📊 Binary size: 456.0K
viworks-backend  | 2025-09-02 19:15:46. | 📊 Binary permissions: -rwxr-xr-x    1 appuser  appuser     464984 Sep  2 06:39 /app/app

PostgreSQL logs:
viworks-postgres  | 2025-09-02 19:15:46.600 UTC [107] ERROR:  relation "idx_mobile_devices_user_id" already exists
viworks-postgres  | 2025-09-02 19:15:46.600 UTC [107] STATEMENT:  CREATE INDEX idx_mobile_devices_user_id ON mobile_devices(user_id);
viworks-postgres  | 2025-09-02 19:15:46.600 UTC [107] ERROR:  relation "idx_otp_challenges_user_id" already exists
viworks-postgres  | 2025-09-02 19:15:46.600 UTC [107] STATEMENT:  CREATE INDEX idx_otp_challenges_user_id ON otp_challenges(user_id);
viworks-postgres  | 2025-09-02 19:15:46.600 UTC [107] ERROR:  relation "idx_otp_challenges_expires_at" already exists
viworks-postgres  | 2025-09-02 19:15:46.600 UTC [107] STATEMENT:  CREATE INDEX idx_otp_challenges_expires_at ON otp_challenges(expires_at);
viworks-postgres  | 2025-09-02 19:15:46.604 UTC [107] ERROR:  trigger "update_users_updated_at" for relation "users" already exists
viworks-postgres  | 2025-09-02 19:15:46.604 UTC [107] STATEMENT:  CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
viworks-postgres  | 2025-09-02 19:15:46.605 UTC [107] ERROR:  trigger "update_policies_updated_at" for relation "policies" already exists
viworks-postgres  | 2025-09-02 19:15:46.605 UTC [107] STATEMENT:  CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
viworks-postgres  | 2025-09-02 19:15:46.607 UTC [107] ERROR:  duplicate key value violates unique constraint "users_username_key"
viworks-postgres  | 2025-09-02 19:15:46.607 UTC [107] DETAIL:  Key (username)=(admin) already exists.
viworks-postgres  | 2025-09-02 19:15:46.607 UTC [107] STATEMENT:  INSERT INTO users (username, email, password_hash, mobile, status, roles) VALUES (
viworks-postgres  | 	    'admin',
viworks-postgres  | 	    'admin@viworks.com',
viworks-postgres  | 	    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5u.Ge', -- admin123
viworks-postgres  | 	    '09123456789',
viworks-postgres  | 	    'active',
viworks-postgres  | 	    '["admin"]'
viworks-postgres  | 	);

Redis logs:
viworks-redis  | 1:C 02 Sep 2025 19:14:44.630 # WARNING Memory overcommit must be enabled! Without it, a background save or replication may fail under low memory condition. Being disabled, it can also cause failures without low memory condition, see https://github.com/jemalloc/jemalloc/issues/1328. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
viworks-redis  | 1:C 02 Sep 2025 19:14:44.631 * oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
viworks-redis  | 1:C 02 Sep 2025 19:14:44.631 * Redis version=7.4.5, bits=64, commit=00000000, modified=0, pid=1, just started
viworks-redis  | 1:C 02 Sep 2025 19:14:44.631 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
viworks-redis  | 1:M 02 Sep 2025 19:14:44.631 * monotonic clock: POSIX clock_gettime
viworks-redis  | 1:M 02 Sep 2025 19:14:44.632 * Running mode=standalone, port=6379.
viworks-redis  | 1:M 02 Sep 2025 19:14:44.633 * Server initialized
viworks-redis  | 1:M 02 Sep 2025 19:14:44.633 * Loading RDB produced by version 7.4.5
viworks-redis  | 1:M 02 Sep 2025 19:14:44.633 * RDB age 15 seconds
viworks-redis  | 1:M 02 Sep 2025 19:14:44.633 * RDB memory usage when created 0.93 Mb
viworks-redis  | 1:M 02 Sep 2025 19:14:44.633 * Done loading RDB, keys loaded: 0, keys expired: 0.
viworks-redis  | 1:M 02 Sep 2025 19:14:44.633 * DB loaded from disk: 0.000 seconds
viworks-redis  | 1:M 02 Sep 2025 19:14:44.633 * Ready to accept connections tcp
✅ Deployment completed successfully!
📅 Deployment completed at: Tue Sep  2 19:16:35 UTC 2025

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
NAME               IMAGE                         COMMAND                  SERVICE    CREATED              STATUS                          PORTS
viworks-backend    digitaloceandocker-backend    "/usr/bin/dumb-init …"   backend    About a minute ago   Restarting (0) 49 seconds ago   
viworks-frontend   digitaloceandocker-frontend   "dumb-init -- node s…"   frontend   About a minute ago   Up About a minute (healthy)     
viworks-nginx      nginx:alpine                  "/docker-entrypoint.…"   nginx      About a minute ago   Up About a minute (healthy)     0.0.0.0:80->80/tcp, [::]:80->80/tcp, 0.0.0.0:443->443/tcp, [::]:443->443/tcp
viworks-postgres   postgres:15-alpine            "docker-entrypoint.s…"   postgres   About a minute ago   Up About a minute (healthy)     
viworks-redis      redis:7-alpine                "docker-entrypoint.s…"   redis      About a minute ago   Up About a minute (healthy)     
viworks-website    digitaloceandocker-website    "docker-entrypoint.s…"   website    About a minute ago   Up About a minute (healthy)     
6m 50s
Run echo "🔍 Verifying deployment..."
🔍 Verifying deployment...
Testing frontend...
⏳ Frontend not ready yet... (1/5)
⏳ Frontend not ready yet... (2/5)
