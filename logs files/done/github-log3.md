deploy
failed 1 minute ago in 3m 42s

1s
2s
1s
2s
0s
3m 32s
Run scp -i ~/.ssh/id_ed25519 deploy.sh ${DROPLET_USER}@${DROPLET_IP}:/tmp/
🚀 Starting ViWorks Automated Deployment...
📅 Deployment started at: Tue Sep  2 06:36:04 UTC 2025
🛑 Stopping all containers gracefully...
time="2025-09-02T06:36:04Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
🛑 Force stopping any running containers...
🧹 Removing containers with specific names...
🧹 Removing orphaned containers...
time="2025-09-02T06:36:05Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
🧹 Cleaning up Docker images...
Total reclaimed space: 0B
Deleted Images:
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

Total reclaimed space: 351MB
🧹 Cleaning up unused networks...
Deleted Networks:
viworks-public
viworks-internal

🔍 Verifying no conflicting containers exist...
🧹 Cleaning up and resetting git repository...
From https://github.com/apebrahimi/viworkdemo002
   0767d6f..9bf87e2  main       -> origin/main
HEAD is now at 9bf87e2 DOCS: Add comprehensive deployment execution guide
🌐 Setting up two-network security architecture...
6e0d9bc11fc89cc6fe0e59787cfa679d0276c856753d718ab9806c89ec40630e
9dc195809dab9dc6c888fafc39d12193bf8b659988caed9c0b59283e155a7020
🔨 Building and starting new containers with two-network security...
 postgres Pulling 
 redis Pulling 
 nginx Pulling 
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
 a992fbc61ecc Waiting 
 cb1ff4086f82 Waiting 
 c9ebe2ff2d2c Waiting 
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
 a612d38c9b48 Downloading [==================================================>]     175B/175B
 a612d38c9b48 Verifying Checksum 
 a612d38c9b48 Download complete 
 51a939567803 Downloading [>                                                  ]  12.32kB/1.116MB
 51a939567803 Verifying Checksum 
 51a939567803 Download complete 
 61a7421693bd Downloading [==================================================>]     969B/969B
 61a7421693bd Verifying Checksum 
 61a7421693bd Download complete 
 61a7421693bd Extracting [==================================================>]     969B/969B
 61a7421693bd Extracting [==================================================>]     969B/969B
 61a7421693bd Pull complete 
 51a939567803 Extracting [=>                                                 ]  32.77kB/1.116MB
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
 6c13c55b4b82 Downloading [>                                                  ]  540.7kB/103.9MB
 0f940631c13f Downloading [=====>                                             ]  1.049kB/9.448kB
 0f940631c13f Downloading [==================================================>]  9.448kB/9.448kB
 0f940631c13f Verifying Checksum 
 0f940631c13f Download complete 
 6c13c55b4b82 Downloading [=====>                                             ]  10.65MB/103.9MB
 6c13c55b4b82 Downloading [========>                                          ]  18.67MB/103.9MB
 6c13c55b4b82 Downloading [=============>                                     ]  27.75MB/103.9MB
 a15854d6fd91 Downloading [==================================================>]     129B/129B
 a15854d6fd91 Verifying Checksum 
 a15854d6fd91 Download complete 
 685be96195b7 Download complete 
 6c13c55b4b82 Downloading [===============>                                   ]  32.55MB/103.9MB
 6c13c55b4b82 Downloading [==================>                                ]  38.42MB/103.9MB
 6c13c55b4b82 Downloading [=====================>                             ]  44.81MB/103.9MB
 6c13c55b4b82 Downloading [=========================>                         ]  52.28MB/103.9MB
 ce414b3fa674 Downloading [========>                                          ]  1.049kB/5.927kB
 ce414b3fa674 Downloading [==================================================>]  5.927kB/5.927kB
 ce414b3fa674 Verifying Checksum 
 ce414b3fa674 Download complete 
 6afcd9ec0fd9 Downloading [==================================================>]     185B/185B
 6afcd9ec0fd9 Verifying Checksum 
 6afcd9ec0fd9 Download complete 
 6c13c55b4b82 Downloading [=============================>                     ]  61.85MB/103.9MB
 6c13c55b4b82 Downloading [=================================>                 ]   70.4MB/103.9MB
 6c13c55b4b82 Downloading [======================================>            ]  81.03MB/103.9MB
 6c13c55b4b82 Downloading [==========================================>        ]  89.04MB/103.9MB
 6bc572a340ec Downloading [>                                                  ]  19.13kB/1.806MB
 6bc572a340ec Verifying Checksum 
 6bc572a340ec Download complete 
 6bc572a340ec Extracting [>                                                  ]  32.77kB/1.806MB
 403e3f251637 Downloading [==================================================>]     628B/628B
 403e3f251637 Verifying Checksum 
 403e3f251637 Download complete 
 6c13c55b4b82 Downloading [===============================================>   ]   98.1MB/103.9MB
 6c13c55b4b82 Verifying Checksum 
 6c13c55b4b82 Download complete 
 6bc572a340ec Extracting [=======>                                           ]  262.1kB/1.806MB
 6c13c55b4b82 Extracting [>                                                  ]  557.1kB/103.9MB
 6bc572a340ec Extracting [=======================================>           ]  1.442MB/1.806MB
 6bc572a340ec Extracting [==================================================>]  1.806MB/1.806MB
 6c13c55b4b82 Extracting [>                                                  ]  1.114MB/103.9MB
 6c13c55b4b82 Extracting [>                                                  ]  1.671MB/103.9MB
 7a8a46741e18 Downloading [==================================================>]     405B/405B
 7a8a46741e18 Verifying Checksum 
 7a8a46741e18 Download complete 
 9adfbae99cb7 Downloading [==================================================>]     955B/955B
 9adfbae99cb7 Verifying Checksum 
 9adfbae99cb7 Download complete 
 6c13c55b4b82 Extracting [=>                                                 ]  2.228MB/103.9MB
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
 6c13c55b4b82 Extracting [=>                                                 ]  3.899MB/103.9MB
 9adfbae99cb7 Pull complete 
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 7a8a46741e18 Pull complete 
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 6c13c55b4b82 Extracting [==>                                                ]  5.571MB/103.9MB
 c9ebe2ff2d2c Pull complete 
 cb1ff4086f82 Downloading [>                                                  ]  172.3kB/16.84MB
 6c13c55b4b82 Extracting [===>                                               ]  7.799MB/103.9MB
 a992fbc61ecc Downloading [=====================================>             ]  1.049kB/1.398kB
 a992fbc61ecc Downloading [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Verifying Checksum 
 a992fbc61ecc Download complete 
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 cb1ff4086f82 Downloading [=======================>                           ]  7.905MB/16.84MB
 a992fbc61ecc Pull complete 
 0368fd46e3c6 Downloading [>                                                  ]  36.92kB/3.638MB
 6c13c55b4b82 Extracting [====>                                              ]   9.47MB/103.9MB
 cb1ff4086f82 Downloading [=====================================>             ]  12.51MB/16.84MB
 0368fd46e3c6 Verifying Checksum 
 0368fd46e3c6 Download complete 
 0368fd46e3c6 Extracting [>                                                  ]  65.54kB/3.638MB
 cb1ff4086f82 Verifying Checksum 
 cb1ff4086f82 Download complete 
 0368fd46e3c6 Extracting [========>                                          ]  589.8kB/3.638MB
 6c13c55b4b82 Extracting [=====>                                             ]  10.58MB/103.9MB
 cb1ff4086f82 Extracting [>                                                  ]  196.6kB/16.84MB
 0368fd46e3c6 Extracting [==================>                                ]  1.311MB/3.638MB
 6c13c55b4b82 Extracting [=====>                                             ]  11.14MB/103.9MB
 6c13c55b4b82 Extracting [=====>                                             ]   11.7MB/103.9MB
 4c55286bbede Downloading [==================================================>]     950B/950B
 4c55286bbede Verifying Checksum 
 4c55286bbede Download complete 
 cb1ff4086f82 Extracting [=>                                                 ]  589.8kB/16.84MB
 0368fd46e3c6 Extracting [=====================>                             ]  1.573MB/3.638MB
 5e28347af205 Downloading [>                                                  ]  2.738kB/173.2kB
 cb1ff4086f82 Extracting [====>                                              ]  1.376MB/16.84MB
 0368fd46e3c6 Extracting [================================>                  ]  2.359MB/3.638MB
 5e28347af205 Verifying Checksum 
 5e28347af205 Download complete 
 6c13c55b4b82 Extracting [======>                                            ]  12.81MB/103.9MB
 311eca34042e Downloading [>                                                  ]  10.95kB/1.003MB
 0368fd46e3c6 Extracting [===========================================>       ]  3.146MB/3.638MB
 cb1ff4086f82 Extracting [======>                                            ]  2.163MB/16.84MB
 311eca34042e Verifying Checksum 
 311eca34042e Download complete 
 0368fd46e3c6 Extracting [==================================================>]  3.638MB/3.638MB
 cb1ff4086f82 Extracting [========>                                          ]  2.949MB/16.84MB
 6c13c55b4b82 Extracting [======>                                            ]  13.93MB/103.9MB
 0368fd46e3c6 Pull complete 
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Extracting [==================================================>]     950B/950B
 cb1ff4086f82 Extracting [===========>                                       ]  3.932MB/16.84MB
 e6fe6f07e192 Downloading [>                                                  ]  127.9kB/12.41MB
 4c55286bbede Pull complete 
 a2cadbfeca72 Downloading [==================================================>]      99B/99B
 a2cadbfeca72 Verifying Checksum 
 a2cadbfeca72 Download complete 
 5e28347af205 Extracting [=========>                                         ]  32.77kB/173.2kB
 e6fe6f07e192 Downloading [==============>                                    ]  3.564MB/12.41MB
 cb1ff4086f82 Extracting [============>                                      ]  4.325MB/16.84MB
 6c13c55b4b82 Extracting [=======>                                           ]  15.04MB/103.9MB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 e6fe6f07e192 Downloading [===============================>                   ]  7.913MB/12.41MB
 cb1ff4086f82 Extracting [==============>                                    ]  4.719MB/16.84MB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 e6fe6f07e192 Downloading [==============================================>    ]  11.46MB/12.41MB
 6c13c55b4b82 Extracting [=======>                                           ]   15.6MB/103.9MB
 4f4fb700ef54 Downloading [==================================================>]      32B/32B
 4f4fb700ef54 Verifying Checksum 
 4f4fb700ef54 Download complete 
 e6fe6f07e192 Verifying Checksum 
 e6fe6f07e192 Download complete 
 cb1ff4086f82 Extracting [===============>                                   ]  5.308MB/16.84MB
 6c13c55b4b82 Extracting [========>                                          ]  16.71MB/103.9MB
 cb1ff4086f82 Extracting [==================>                                ]  6.291MB/16.84MB
 6c13c55b4b82 Extracting [========>                                          ]  17.27MB/103.9MB
 a976ed7e7808 Downloading [==================================================>]     574B/574B
 a976ed7e7808 Verifying Checksum 
 a976ed7e7808 Download complete 
 cb1ff4086f82 Extracting [====================>                              ]  6.881MB/16.84MB
 5e28347af205 Pull complete 
 311eca34042e Extracting [=>                                                 ]  32.77kB/1.003MB
 6c13c55b4b82 Extracting [========>                                          ]  17.83MB/103.9MB
 cb1ff4086f82 Extracting [======================>                            ]  7.471MB/16.84MB
 311eca34042e Extracting [===================>                               ]  393.2kB/1.003MB
 cb1ff4086f82 Extracting [=======================>                           ]  8.061MB/16.84MB
 311eca34042e Extracting [=================================================> ]    983kB/1.003MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 6c13c55b4b82 Extracting [=========>                                         ]  18.94MB/103.9MB
 311eca34042e Pull complete 
 e6fe6f07e192 Extracting [>                                                  ]  131.1kB/12.41MB
 cb1ff4086f82 Extracting [==========================>                        ]  8.847MB/16.84MB
 cb1ff4086f82 Extracting [===========================>                       ]  9.241MB/16.84MB
 e6fe6f07e192 Extracting [=>                                                 ]  393.2kB/12.41MB
 6c13c55b4b82 Extracting [=========>                                         ]  20.05MB/103.9MB
 6c13c55b4b82 Extracting [=========>                                         ]  20.61MB/103.9MB
 e6fe6f07e192 Extracting [=====>                                             ]  1.311MB/12.41MB
 cb1ff4086f82 Extracting [=============================>                     ]  10.03MB/16.84MB
 e6fe6f07e192 Extracting [=======>                                           ]  1.835MB/12.41MB
 6c13c55b4b82 Extracting [==========>                                        ]  21.73MB/103.9MB
 cb1ff4086f82 Extracting [================================>                  ]  10.81MB/16.84MB
 e6fe6f07e192 Extracting [==========>                                        ]   2.49MB/12.41MB
 6c13c55b4b82 Extracting [==========>                                        ]  22.84MB/103.9MB
 cb1ff4086f82 Extracting [===================================>               ]   11.8MB/16.84MB
 e6fe6f07e192 Extracting [=============>                                     ]  3.277MB/12.41MB
 cb1ff4086f82 Extracting [=====================================>             ]  12.58MB/16.84MB
 6c13c55b4b82 Extracting [===========>                                       ]  23.95MB/103.9MB
 e6fe6f07e192 Extracting [================>                                  ]  4.063MB/12.41MB
 cb1ff4086f82 Extracting [=======================================>           ]  13.37MB/16.84MB
 e6fe6f07e192 Extracting [===================>                               ]   4.85MB/12.41MB
 6c13c55b4b82 Extracting [============>                                      ]  25.07MB/103.9MB
 cb1ff4086f82 Extracting [==========================================>        ]  14.16MB/16.84MB
 e6fe6f07e192 Extracting [========================>                          ]  6.029MB/12.41MB
 6c13c55b4b82 Extracting [============>                                      ]  26.18MB/103.9MB
 cb1ff4086f82 Extracting [=============================================>     ]  15.34MB/16.84MB
 e6fe6f07e192 Extracting [===========================>                       ]  6.816MB/12.41MB
 6c13c55b4b82 Extracting [=============>                                     ]   27.3MB/103.9MB
 cb1ff4086f82 Extracting [===============================================>   ]  16.12MB/16.84MB
 e6fe6f07e192 Extracting [==============================>                    ]  7.602MB/12.41MB
 6c13c55b4b82 Extracting [=============>                                     ]  28.41MB/103.9MB
 e6fe6f07e192 Extracting [==================================>                ]  8.651MB/12.41MB
 6c13c55b4b82 Extracting [==============>                                    ]  29.52MB/103.9MB
 cb1ff4086f82 Extracting [==================================================>]  16.84MB/16.84MB
 e6fe6f07e192 Extracting [======================================>            ]  9.568MB/12.41MB
 6c13c55b4b82 Extracting [==============>                                    ]  30.64MB/103.9MB
 e6fe6f07e192 Extracting [==========================================>        ]  10.62MB/12.41MB
 cb1ff4086f82 Pull complete 
 nginx Pulled 
 e6fe6f07e192 Extracting [================================================>  ]  11.93MB/12.41MB
 6c13c55b4b82 Extracting [===============>                                   ]  31.75MB/103.9MB
 e6fe6f07e192 Extracting [==================================================>]  12.41MB/12.41MB
 e6fe6f07e192 Pull complete 
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 6c13c55b4b82 Extracting [================>                                  ]  33.42MB/103.9MB
 a2cadbfeca72 Pull complete 
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Pull complete 
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 a976ed7e7808 Pull complete 
 redis Pulled 
 6c13c55b4b82 Extracting [=================>                                 ]  35.65MB/103.9MB
 6c13c55b4b82 Extracting [==================>                                ]  37.88MB/103.9MB
 6c13c55b4b82 Extracting [===================>                               ]  40.67MB/103.9MB
 6c13c55b4b82 Extracting [====================>                              ]  42.89MB/103.9MB
 6c13c55b4b82 Extracting [=====================>                             ]  45.12MB/103.9MB
 6c13c55b4b82 Extracting [=======================>                           ]  47.91MB/103.9MB
 6c13c55b4b82 Extracting [=======================>                           ]  49.58MB/103.9MB
 6c13c55b4b82 Extracting [========================>                          ]  50.69MB/103.9MB
 6c13c55b4b82 Extracting [========================>                          ]  51.81MB/103.9MB
 6c13c55b4b82 Extracting [=========================>                         ]  53.48MB/103.9MB
 6c13c55b4b82 Extracting [==========================>                        ]  55.15MB/103.9MB
 6c13c55b4b82 Extracting [===========================>                       ]  57.38MB/103.9MB
 6c13c55b4b82 Extracting [============================>                      ]  60.16MB/103.9MB
 6c13c55b4b82 Extracting [==============================>                    ]  62.39MB/103.9MB
 6c13c55b4b82 Extracting [===============================>                   ]  65.18MB/103.9MB
 6c13c55b4b82 Extracting [================================>                  ]   67.4MB/103.9MB
 6c13c55b4b82 Extracting [=================================>                 ]  69.63MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  72.97MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.65MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]   75.2MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]  76.32MB/103.9MB
 6c13c55b4b82 Extracting [=====================================>             ]  77.43MB/103.9MB
 6c13c55b4b82 Extracting [======================================>            ]   79.1MB/103.9MB
 6c13c55b4b82 Extracting [======================================>            ]  80.77MB/103.9MB
 6c13c55b4b82 Extracting [=======================================>           ]  81.89MB/103.9MB
 6c13c55b4b82 Extracting [========================================>          ]  83.56MB/103.9MB
 6c13c55b4b82 Extracting [========================================>          ]  84.67MB/103.9MB
 6c13c55b4b82 Extracting [=========================================>         ]  86.34MB/103.9MB
 6c13c55b4b82 Extracting [==========================================>        ]  88.57MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]  89.69MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]  90.24MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]   90.8MB/103.9MB
 6c13c55b4b82 Extracting [============================================>      ]  93.03MB/103.9MB
 6c13c55b4b82 Extracting [=============================================>     ]  95.26MB/103.9MB
 6c13c55b4b82 Extracting [===============================================>   ]  98.04MB/103.9MB
 6c13c55b4b82 Extracting [================================================>  ]  100.8MB/103.9MB
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

#2 [backend internal] load build definition from Dockerfile.fixed
#2 transferring dockerfile: 1.87kB done
#2 DONE 0.0s

#3 [frontend internal] load build definition from Dockerfile
#3 transferring dockerfile: 1.25kB done
#3 DONE 0.0s

#4 [agent internal] load build definition from Dockerfile.alpine-production
#4 transferring dockerfile: 1.79kB done
#4 WARN: FromAsCasing: 'as' and 'FROM' keywords' casing do not match (line 2)
#4 DONE 0.0s

#5 [agent internal] load metadata for docker.io/library/rust:1.89.0-alpine
#5 ...

#6 [website internal] load build definition from Dockerfile
#6 transferring dockerfile: 2.04kB done
#6 DONE 0.1s

#5 [backend internal] load metadata for docker.io/library/rust:1.89.0-alpine
#5 ...

#7 [agent internal] load metadata for docker.io/library/alpine:latest
#7 DONE 0.4s

#8 [backend builder  1/11] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#8 DONE 0.0s

#9 [backend stage-1 1/7] FROM docker.io/library/alpine:3.22@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#9 DONE 0.0s

#10 [backend builder  3/11] RUN apk add --no-cache     pkgconfig     openssl-dev     postgresql-dev     musl-dev     gcc     curl
#10 CACHED

#11 [backend builder  2/11] WORKDIR /app
#11 CACHED

#12 [backend builder  4/11] RUN rustup target add x86_64-unknown-linux-musl
#12 CACHED

#5 [backend internal] load metadata for docker.io/library/rust:1.89.0-alpine
#5 DONE 0.4s

#13 [frontend internal] load metadata for docker.io/library/node:22-alpine
#13 DONE 0.4s

#14 [website internal] load metadata for docker.io/library/node:18-alpine
#14 DONE 0.3s

#15 [backend internal] load metadata for docker.io/library/alpine:3.22
#15 DONE 0.4s

#16 [agent internal] load .dockerignore
#16 transferring context: 2B done
#16 DONE 0.0s

#17 [frontend internal] load .dockerignore
#17 transferring context: 2B 0.0s done
#17 DONE 0.0s

#18 [backend internal] load .dockerignore
#18 transferring context: 2B done
#18 DONE 0.0s

#19 [website internal] load .dockerignore
#19 transferring context: 2B done
#19 DONE 0.0s

#20 [agent stage-1 1/9] FROM docker.io/library/alpine:latest@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#20 DONE 0.0s

#21 [agent internal] load build context
#21 transferring context: 496B done
#21 DONE 0.0s

#22 [backend internal] load build context
#22 DONE 0.0s

#23 [frontend internal] load build context
#23 DONE 0.0s

#24 [frontend builder 1/6] FROM docker.io/library/node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9
#24 DONE 0.0s

#25 [website base 1/1] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#25 DONE 0.0s

#26 [agent stage-1 5/9] COPY --from=builder /app/target/release/viworks-gateway-agent /usr/local/bin/
#26 CACHED

#27 [agent stage-1 6/9] COPY agent.toml /etc/viworks/
#27 CACHED

#28 [agent builder  3/10] WORKDIR /app
#28 CACHED

#29 [agent builder  5/10] RUN mkdir src && echo "fn main() {}" > src/main.rs
#29 CACHED

#30 [agent stage-1 2/9] RUN apk update && apk add --no-cache     ca-certificates     libssl3     && rm -rf /var/cache/apk/*
#30 CACHED

#31 [agent builder  2/10] RUN apk update && apk add --no-cache     build-base     pkgconfig     openssl-dev     musl-dev     ca-certificates     && rm -rf /var/cache/apk/*
#31 CACHED

#32 [agent builder 10/10] RUN strip target/release/viworks-gateway-agent
#32 CACHED

#33 [agent builder  9/10] RUN cargo build --release
#33 CACHED

#34 [agent builder  8/10] COPY src/ ./src/
#34 CACHED

#35 [agent builder  4/10] COPY Cargo.toml Cargo.lock ./
#35 CACHED

#36 [agent builder  7/10] RUN rm src/main.rs
#36 CACHED

#37 [agent stage-1 3/9] RUN addgroup -g 1000 viworks &&     adduser -D -s /bin/bash -u 1000 -G viworks viworks
#37 CACHED

#38 [agent stage-1 7/9] RUN chown -R viworks:viworks /etc/viworks /var/log/viworks
#38 CACHED

#39 [agent stage-1 4/9] RUN mkdir -p /etc/viworks /var/log/viworks /usr/local/bin
#39 CACHED

#40 [agent stage-1 8/9] RUN chmod +x /usr/local/bin/viworks-gateway-agent
#40 CACHED

#41 [agent builder  6/10] RUN cargo build --release
#41 CACHED

#42 [agent stage-1 9/9] RUN chmod 644 /etc/viworks/agent.toml
#42 CACHED

#43 [agent] exporting to image
#43 exporting layers done
#43 writing image sha256:c72f3fb0a5146067e1440591134c67a46d7757775718b8a075a1596f8457d136 done
#43 naming to docker.io/library/digitaloceandocker-agent 0.0s done
#43 DONE 0.0s

#23 [frontend internal] load build context
#23 transferring context: 5.42kB 0.1s done
#23 DONE 0.1s

#44 [website internal] load build context
#44 transferring context: 7.37kB 0.0s done
#44 DONE 0.1s

#22 [backend internal] load build context
#22 transferring context: 366.69kB 0.1s done
#22 DONE 0.1s

#45 [backend builder  5/11] COPY Cargo.toml Cargo.lock* ./
#45 DONE 0.7s

#46 [backend builder  6/11] RUN mkdir src && echo "fn main() {}" > src/main.rs
#46 DONE 0.3s

#47 [frontend builder 6/6] RUN npm run build
#47 CACHED

#48 [frontend runner 4/7] WORKDIR /app
#48 CACHED

#49 [frontend runner 3/7] RUN addgroup -g 1001 -S nodejs &&     adduser -u 1001 -S nextjs -G nodejs
#49 CACHED

#50 [frontend runner 5/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#50 CACHED

#51 [frontend runner 2/7] RUN apk add --no-cache dumb-init
#51 CACHED

#52 [frontend builder 3/6] COPY package*.json ./
#52 CACHED

#53 [frontend runner 6/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#53 CACHED

#54 [frontend builder 2/6] WORKDIR /app
#54 CACHED

#55 [frontend builder 5/6] COPY . .
#55 CACHED

#56 [frontend builder 4/6] RUN npm install
#56 CACHED

#57 [frontend runner 7/7] RUN mkdir -p ./public
#57 CACHED

#58 [frontend] exporting to image
#58 exporting layers done
#58 writing image sha256:5df242396420b99f980135e561ed081c939e3a76f937599d1f50f5dd9ca28d95 done
#58 naming to docker.io/library/digitaloceandocker-frontend done
#58 DONE 0.0s

#59 [agent] resolving provenance for metadata file
#59 DONE 0.0s

#60 [website runner 2/8] RUN addgroup --system --gid 1001 nodejs
#60 CACHED

#61 [website runner 6/8] RUN chown nextjs:nodejs .next
#61 CACHED

#62 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#62 CACHED

#63 [website builder 5/5] RUN npm run build
#63 CACHED

#64 [website runner 7/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#64 CACHED

#65 [website runner 4/8] COPY --from=builder /app/public ./public
#65 CACHED

#66 [website runner 3/8] RUN adduser --system --uid 1001 nextjs
#66 CACHED

#67 [website builder 2/5] COPY --from=deps /app/node_modules ./node_modules
#67 CACHED

#68 [website deps 1/4] RUN apk add --no-cache libc6-compat
#68 CACHED

#69 [website deps 3/4] COPY package.json pnpm-lock.yaml* ./
#69 CACHED

#70 [website builder 3/5] COPY . .
#70 CACHED

#71 [website runner 5/8] RUN mkdir .next
#71 CACHED

#72 [website deps 2/4] WORKDIR /app
#72 CACHED

#73 [website builder 1/5] WORKDIR /app
#73 CACHED

#74 [website builder 4/5] RUN mkdir -p public
#74 CACHED

#75 [website runner 8/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#75 CACHED

#76 [backend builder  7/11] RUN cargo build --release
#76 0.569     Updating crates.io index
#76 2.942  Downloading crates ...
#76 3.030   Downloaded actix-cors v0.7.1
#76 3.048   Downloaded alloc-stdlib v0.2.2
#76 3.057   Downloaded http-body v0.4.6
#76 3.069   Downloaded sqlx-macros v0.8.6
#76 3.096   Downloaded local-waker v0.1.4
#76 3.109   Downloaded rand_chacha v0.3.1
#76 3.123   Downloaded serde_urlencoded v0.7.1
#76 3.131   Downloaded signature v2.2.0
#76 3.138   Downloaded native-tls v0.2.14
#76 3.145   Downloaded nu-ansi-term v0.50.1
#76 3.151   Downloaded serde v1.0.219
#76 3.165   Downloaded rustls-webpki v0.103.4
#76 3.174   Downloaded zerocopy v0.8.26
#76 3.218   Downloaded reqwest v0.11.27
#76 3.232   Downloaded serde_json v1.0.143
#76 3.250   Downloaded regex v1.11.2
#76 3.265   Downloaded redis v0.24.0
#76 3.279   Downloaded syn v2.0.106
#76 3.317   Downloaded actix-web v4.11.0
#76 3.348   Downloaded webpki-***s v1.0.2
#76 3.364   Downloaded jiff v0.2.15
#76 3.402   Downloaded libc v0.2.175
#76 3.446   Downloaded tokio v1.47.1
#76 3.515   Downloaded openssl-probe v0.1.6
#76 3.518   Downloaded once_cell v1.21.3
#76 3.524   Downloaded rustls v0.23.31
#76 3.550   Downloaded num-traits v0.2.19
#76 3.556   Downloaded openssl-macros v0.1.1
#76 3.558   Downloaded num-iter v0.1.45
#76 3.561   Downloaded num-integer v0.1.46
#76 3.565   Downloaded num-conv v0.1.0
#76 3.568   Downloaded regex-syntax v0.8.6
#76 3.586   Downloaded zstd-sys v2.0.15+zstd.1.5.7
#76 3.615   Downloaded vcpkg v0.2.15
#76 3.694   Downloaded chrono v0.4.41
#76 3.707   Downloaded regex-automata v0.4.10
#76 3.740   Downloaded hyper v0.14.32
#76 3.755   Downloaded tracing-subscriber v0.3.20
#76 3.767   Downloaded sqlx v0.8.6
#76 3.789   Downloaded brotli v8.0.2
#76 3.818   Downloaded brotli-decompressor v5.0.0
#76 3.829   Downloaded rand v0.9.2
#76 3.837   Downloaded libm v0.2.15
#76 3.858   Downloaded icu_properties_data v2.0.1
#76 3.876   Downloaded zerovec v0.11.4
#76 3.886   Downloaded hkdf v0.12.4
#76 3.892   Downloaded aho-corasick v1.1.3
#76 3.903   Downloaded smallvec v1.15.1
#76 3.909   Downloaded slab v0.4.11
#76 3.913   Downloaded serde_derive v1.0.219
#76 3.919   Downloaded rustls-pki-types v1.12.0
#76 3.928   Downloaded regex-lite v0.1.7
#76 3.934   Downloaded rand v0.8.5
#76 3.940   Downloaded mio v1.0.4
#76 3.951   Downloaded idna v1.1.0
#76 3.959   Downloaded unicode-normalization v0.1.24
#76 3.967   Downloaded tokio-util v0.7.16
#76 3.985   Downloaded time v0.3.41
#76 4.005   Downloaded sqlx-postgres v0.8.6
#76 4.025   Downloaded h2 v0.3.27
#76 4.041   Downloaded futures-util v0.3.31
#76 4.069   Downloaded simple_asn1 v0.6.3
#76 4.073   Downloaded signal-hook-registry v1.4.6
#76 4.077   Downloaded shlex v1.3.0
#76 4.081   Downloaded sharded-slab v0.1.7
#76 4.089   Downloaded sha2 v0.10.9
#76 4.096   Downloaded sha1_smol v1.0.1
#76 4.102   Downloaded ryu v1.0.20
#76 4.110   Downloaded rsa v0.9.8
#76 4.123   Downloaded indexmap v2.11.0
#76 4.136   Downloaded icu_locale_core v2.0.0
#76 4.152   Downloaded url v2.5.7
#76 4.162   Downloaded libsqlite3-sys v0.30.1
#76 4.347   Downloaded openssl-sys v0.9.109
#76 4.359   Downloaded num-bigint-dig v0.8.4
#76 4.371   Downloaded ring v0.17.14
#76 4.473   Downloaded num-bigint v0.4.6
#76 4.485   Downloaded tracing v0.1.41
#76 4.495   Downloaded sqlx-sqlite v0.8.6
#76 4.507   Downloaded sqlx-core v0.8.6
#76 4.525   Downloaded hashbrown v0.15.5
#76 4.538   Downloaded combine v4.6.7
#76 4.552   Downloaded sha1 v0.10.6
#76 4.557   Downloaded rustls-pemfile v1.0.4
#76 4.563   Downloaded parking_lot v0.12.4
#76 4.572   Downloaded memchr v2.7.5
#76 4.585   Downloaded openssl v0.10.73
#76 4.607   Downloaded language-tags v0.3.2
#76 4.613   Downloaded encoding_rs v0.8.35
#76 4.668   Downloaded icu_normalizer_data v2.0.0
#76 4.674   Downloaded icu_collections v2.0.0
#76 4.688   Downloaded zerotrie v0.2.2
#76 4.698   Downloaded uuid v1.18.0
#76 4.707   Downloaded unicode-ident v1.0.18
#76 4.714   Downloaded unicode-bidi v0.3.18
#76 4.721   Downloaded typenum v1.18.0
#76 4.730   Downloaded tracing-core v0.1.34
#76 4.737   Downloaded tinyvec v1.10.0
#76 4.744   Downloaded socket2 v0.6.0
#76 4.750   Downloaded http v0.2.12
#76 4.759   Downloaded cc v1.2.34
#76 4.768   Downloaded actix-http v3.11.1
#76 4.789   Downloaded scopeguard v1.2.0
#76 4.793   Downloaded rand_core v0.9.3
#76 4.797   Downloaded rand_core v0.6.4
#76 4.801   Downloaded rand_chacha v0.9.0
#76 4.805   Downloaded quote v1.0.40
#76 4.812   Downloaded proc-macro2 v1.0.101
#76 4.820   Downloaded powerfmt v0.2.0
#76 4.824   Downloaded potential_utf v0.1.3
#76 4.827   Downloaded pkg-config v0.3.32
#76 4.832   Downloaded pkcs8 v0.10.2
#76 4.838   Downloaded pkcs1 v0.7.5
#76 4.844   Downloaded pin-utils v0.1.0
#76 4.847   Downloaded pin-project-lite v0.2.16
#76 4.863   Downloaded pin-project-internal v1.1.10
#76 4.866   Downloaded pin-project v1.1.10
#76 4.895   Downloaded pem-rfc7468 v0.7.0
#76 4.900   Downloaded pem v3.0.5
#76 4.904   Downloaded parking_lot_core v0.9.11
#76 4.909   Downloaded miniz_oxide v0.8.9
#76 4.915   Downloaded lock_api v0.4.13
#76 4.919   Downloaded jsonwebtoken v9.3.1
#76 4.930   Downloaded ipnet v2.11.0
#76 4.934   Downloaded icu_provider v2.0.0
#76 4.942   Downloaded icu_properties v2.0.1
#76 4.947   Downloaded icu_normalizer v2.0.0
#76 4.956   Downloaded iana-time-zone v0.1.63
#76 4.963   Downloaded zstd v0.13.3
#76 4.970   Downloaded yoke v0.8.0
#76 4.975   Downloaded whoami v1.6.1
#76 4.979   Downloaded unicode-properties v0.1.3
#76 4.984   Downloaded tracing-attributes v0.1.30
#76 4.990   Downloaded tokio-stream v0.1.17
#76 5.001   Downloaded sqlx-mysql v0.8.6
#76 5.015   Downloaded futures-intrusive v0.5.0
#76 5.026   Downloaded der v0.7.10
#76 5.039   Downloaded crossbeam-channel v0.5.15
#76 5.050   Downloaded bytes v1.10.1
#76 5.059   Downloaded base64 v0.22.1
#76 5.068   Downloaded base64 v0.21.7
#76 5.079   Downloaded ppv-lite86 v0.2.21
#76 5.082   Downloaded percent-encoding v2.3.2
#76 5.085   Downloaded parking v2.2.1
#76 5.087   Downloaded mime v0.3.17
#76 5.090   Downloaded md-5 v0.10.6
#76 5.094   Downloaded matchers v0.2.0
#76 5.097   Downloaded log v0.4.27
#76 5.102   Downloaded litemap v0.8.0
#76 5.108   Downloaded jobserver v0.1.34
#76 5.113   Downloaded itoa v1.0.15
#76 5.117   Downloaded inout v0.1.4
#76 5.120   Downloaded impl-more v0.1.9
#76 5.126   Downloaded idna_adapter v1.2.1
#76 5.129   Downloaded hyper-tls v0.5.0
#76 5.132   Downloaded zstd-safe v7.2.4
#76 5.137   Downloaded zeroize v1.8.1
#76 5.141   Downloaded yoke-derive v0.8.0
#76 5.144   Downloaded writeable v0.6.1
#76 5.149   Downloaded webpki-***s v0.26.11
#76 5.152   Downloaded want v0.3.1
#76 5.154   Downloaded utf8parse v0.2.2
#76 5.157   Downloaded utf8_iter v1.0.4
#76 5.160   Downloaded untrusted v0.9.0
#76 5.163   Downloaded unicode-xid v0.2.6
#76 5.167   Downloaded tower-service v0.3.3
#76 5.169   Downloaded tokio-retry v0.3.0
#76 5.173   Downloaded tokio-native-tls v0.3.1
#76 5.177   Downloaded tokio-macros v2.5.0
#76 5.180   Downloaded tinystr v0.8.1
#76 5.185   Downloaded time-macros v0.2.22
#76 5.191   Downloaded time-core v0.1.4
#76 5.194   Downloaded thread_local v1.1.9
#76 5.198   Downloaded thiserror-impl v2.0.16
#76 5.202   Downloaded thiserror v2.0.16
#76 5.216   Downloaded synstructure v0.13.2
#76 5.220   Downloaded subtle v2.6.1
#76 5.223   Downloaded stringprep v0.1.5
#76 5.226   Downloaded stable_deref_trait v1.2.0
#76 5.229   Downloaded sqlx-macros-core v0.8.6
#76 5.234   Downloaded spki v0.7.3
#76 5.239   Downloaded spin v0.9.8
#76 5.246   Downloaded socket2 v0.5.10
#76 5.251   Downloaded socket2 v0.4.10
#76 5.256   Downloaded httpdate v1.0.3
#76 5.259   Downloaded httparse v1.10.1
#76 5.266   Downloaded hmac v0.12.1
#76 5.271   Downloaded getrandom v0.3.3
#76 5.281   Downloaded getrandom v0.2.16
#76 5.289   Downloaded futures v0.3.31
#76 5.301   Downloaded flume v0.11.1
#76 5.310   Downloaded flate2 v1.1.2
#76 5.321   Downloaded event-listener v5.4.1
#76 5.327   Downloaded either v1.15.0
#76 5.331   Downloaded derive_more-impl v2.0.1
#76 5.343   Downloaded derive_more v2.0.1
#76 5.365   Downloaded crossbeam-utils v0.8.21
#76 5.372   Downloaded cookie v0.16.2
#76 5.378   Downloaded const-oid v0.9.6
#76 5.382   Downloaded bitflags v2.9.3
#76 5.391   Downloaded arc-swap v1.7.1
#76 5.400   Downloaded anyhow v1.0.99
#76 5.410   Downloaded allocator-api2 v0.2.21
#76 5.416   Downloaded actix-server v2.6.0
#76 5.422   Downloaded local-channel v0.1.5
#76 5.425   Downloaded lazy_static v1.5.0
#76 5.429   Downloaded is_terminal_polyfill v1.70.1
#76 5.432   Downloaded zerovec-derive v0.11.1
#76 5.435   Downloaded zerofrom-derive v0.1.6
#76 5.444   Downloaded zerofrom v0.1.6
#76 5.444   Downloaded version_check v0.9.5
#76 5.444   Downloaded try-lock v0.2.5
#76 5.447   Downloaded tracing-log v0.2.0
#76 5.451   Downloaded tinyvec_macros v0.1.1
#76 5.454   Downloaded sync_wrapper v0.1.2
#76 5.456   Downloaded home v0.5.11
#76 5.459   Downloaded hex v0.4.3
#76 5.463   Downloaded hashlink v0.10.0
#76 5.467   Downloaded generic-array v0.14.7
#76 5.470   Downloaded futures-sink v0.3.31
#76 5.472   Downloaded futures-macro v0.3.31
#76 5.474   Downloaded futures-executor v0.3.31
#76 5.477   Downloaded futures-channel v0.3.31
#76 5.481   Downloaded env_logger v0.11.8
#76 5.486   Downloaded env_filter v0.1.3
#76 5.489   Downloaded dotenvy v0.15.7
#76 5.494   Downloaded displaydoc v0.2.5
#76 5.500   Downloaded crc32fast v1.5.0
#76 5.504   Downloaded concurrent-queue v2.5.0
#76 5.507   Downloaded base64ct v1.8.0
#76 5.511   Downloaded async-trait v0.1.89
#76 5.517   Downloaded anstyle-parse v0.2.7
#76 5.520   Downloaded anstream v0.6.20
#76 5.525   Downloaded actix-web-codegen v4.3.0
#76 5.532   Downloaded actix-service v2.0.3
#76 5.536   Downloaded actix-router v0.5.3
#76 5.540   Downloaded actix-codec v0.5.2
#76 5.543   Downloaded futures-task v0.3.31
#76 5.545   Downloaded futures-io v0.3.31
#76 5.547   Downloaded futures-core v0.3.31
#76 5.550   Downloaded form_urlencoded v1.2.2
#76 5.552   Downloaded foreign-types v0.3.2
#76 5.554   Downloaded foldhash v0.1.5
#76 5.557   Downloaded fnv v1.0.7
#76 5.559   Downloaded equivalent v1.0.2
#76 5.561   Downloaded digest v0.10.7
#76 5.564   Downloaded deranged v0.4.0
#76 5.568   Downloaded crypto-common v0.1.6
#76 5.570   Downloaded crossbeam-queue v0.3.12
#76 5.573   Downloaded crc-catalog v2.4.0
#76 5.576   Downloaded crc v3.3.0
#76 5.579   Downloaded colorchoice v1.0.4
#76 5.581   Downloaded cipher v0.4.4
#76 5.585   Downloaded cfg-if v1.0.3
#76 5.588   Downloaded bytestring v1.4.0
#76 5.590   Downloaded byteorder v1.5.0
#76 5.593   Downloaded blowfish v0.9.1
#76 5.597   Downloaded block-buffer v0.10.4
#76 5.599   Downloaded bcrypt v0.15.1
#76 5.601   Downloaded autocfg v1.5.0
#76 5.605   Downloaded anstyle-query v1.1.4
#76 5.609   Downloaded anstyle v1.0.11
#76 5.612   Downloaded alloc-no-stdlib v2.0.4
#76 5.615   Downloaded adler2 v2.0.1
#76 5.618   Downloaded actix_derive v0.6.2
#76 5.621   Downloaded actix-rt v2.10.0
#76 5.624   Downloaded actix-macros v0.2.4
#76 5.626   Downloaded actix v0.13.5
#76 5.635   Downloaded heck v0.5.0
#76 5.637   Downloaded foreign-types-shared v0.1.1
#76 5.638   Downloaded cpufeatures v0.2.17
#76 5.641   Downloaded atoi v2.0.0
#76 5.643   Downloaded actix-utils v3.0.1
#76 5.910    Compiling proc-macro2 v1.0.101
#76 5.910    Compiling unicode-ident v1.0.18
#76 6.092    Compiling libc v0.2.175
#76 6.873    Compiling serde v1.0.219
#76 8.680    Compiling quote v1.0.40
#76 9.251    Compiling syn v2.0.106
#76 9.715    Compiling cfg-if v1.0.3
#76 9.786    Compiling autocfg v1.5.0
#76 12.69    Compiling jobserver v0.1.34
#76 13.43    Compiling shlex v1.3.0
#76 13.79    Compiling cc v1.2.34
#76 17.97    Compiling version_check v0.9.5
#76 18.48    Compiling typenum v1.18.0
#76 19.01    Compiling synstructure v0.13.2
#76 20.19    Compiling generic-array v0.14.7
#76 20.44    Compiling lock_api v0.4.13
#76 20.71    Compiling parking_lot_core v0.9.11
#76 21.03    Compiling pin-project-lite v0.2.16
#76 21.12    Compiling log v0.4.27
#76 21.57    Compiling memchr v2.7.5
#76 22.67    Compiling serde_derive v1.0.219
#76 23.78    Compiling zerofrom-derive v0.1.6
#76 26.71    Compiling yoke-derive v0.8.0
#76 28.95    Compiling zerovec-derive v0.11.1
#76 31.75    Compiling displaydoc v0.2.5
#76 33.07    Compiling futures-core v0.3.31
#76 33.25    Compiling bytes v1.10.1
#76 35.01    Compiling scopeguard v1.2.0
#76 35.56    Compiling icu_normalizer_data v2.0.0
#76 35.80    Compiling icu_properties_data v2.0.1
#76 36.06    Compiling tracing-attributes v0.1.30
#76 36.63    Compiling smallvec v1.15.1
#76 37.79    Compiling parking_lot v0.12.4
#76 38.62    Compiling once_cell v1.21.3
#76 38.95    Compiling zerocopy v0.8.26
#76 38.98    Compiling tokio-macros v2.5.0
#76 39.47    Compiling mio v1.0.4
#76 40.18    Compiling socket2 v0.6.0
#76 40.49    Compiling signal-hook-registry v1.4.6
#76 41.31    Compiling futures-sink v0.3.31
#76 41.36    Compiling tokio v1.47.1
#76 41.42    Compiling zerofrom v0.1.6
#76 41.75    Compiling stable_deref_trait v1.2.0
#76 41.84    Compiling itoa v1.0.15
#76 42.07    Compiling yoke v0.8.0
#76 51.45    Compiling crossbeam-utils v0.8.21
#76 51.82    Compiling pkg-config v0.3.32
#76 54.88    Compiling zerovec v0.11.4
#76 57.42    Compiling futures-channel v0.3.31
#76 57.84    Compiling tracing-core v0.1.34
#76 59.41    Compiling futures-macro v0.3.31
#76 61.44    Compiling slab v0.4.11
#76 61.84    Compiling pin-utils v0.1.0
#76 61.92    Compiling futures-io v0.3.31
#76 62.15    Compiling futures-task v0.3.31
#76 62.39    Compiling futures-util v0.3.31
#76 64.28    Compiling crypto-common v0.1.6
#76 64.42    Compiling serde_json v1.0.143
#76 64.64    Compiling tracing v0.1.41
#76 65.27    Compiling tinystr v0.8.1
#76 65.64    Compiling litemap v0.8.0
#76 66.09    Compiling subtle v2.6.1
#76 66.42    Compiling writeable v0.6.1
#76 67.33    Compiling icu_locale_core v2.0.0
#76 70.80    Compiling potential_utf v0.1.3
#76 71.02    Compiling zerotrie v0.2.2
#76 71.20    Compiling getrandom v0.2.16
#76 71.52    Compiling foldhash v0.1.5
#76 71.67    Compiling equivalent v1.0.2
#76 71.74    Compiling thiserror v2.0.16
#76 71.92    Compiling allocator-api2 v0.2.21
#76 72.16    Compiling icu_provider v2.0.0
#76 73.02    Compiling hashbrown v0.15.5
#76 74.78    Compiling icu_collections v2.0.0
#76 76.33    Compiling block-buffer v0.10.4
#76 76.97    Compiling getrandom v0.3.3
#76 77.46    Compiling percent-encoding v2.3.2
#76 78.76    Compiling bitflags v2.9.3
#76 80.75    Compiling ppv-lite86 v0.2.21
#76 81.41    Compiling digest v0.10.7
#76 81.80    Compiling tokio-util v0.7.16
#76 82.49    Compiling thiserror-impl v2.0.16
#76 83.32    Compiling num-traits v0.2.19
#76 83.59    Compiling rustls v0.23.31
#76 85.16    Compiling icu_properties v2.0.1
#76 85.44    Compiling icu_normalizer v2.0.0
#76 88.17    Compiling indexmap v2.11.0
#76 88.62    Compiling ring v0.17.14
#76 89.44    Compiling fnv v1.0.7
#76 89.51    Compiling ryu v1.0.20
#76 89.86    Compiling zeroize v1.8.1
#76 90.08    Compiling vcpkg v0.2.15
#76 90.66    Compiling rustls-pki-types v1.12.0
#76 91.31    Compiling openssl-sys v0.9.109
#76 91.51    Compiling http v0.2.12
#76 95.15    Compiling idna_adapter v1.2.1
#76 97.25    Compiling form_urlencoded v1.2.2
#76 97.61    Compiling aho-corasick v1.1.3
#76 100.3    Compiling base64 v0.22.1
#76 101.0    Compiling regex-syntax v0.8.6
#76 104.3    Compiling utf8_iter v1.0.4
#76 104.5    Compiling idna v1.1.0
#76 107.3    Compiling regex-automata v0.4.10
#76 133.8    Compiling zstd-sys v2.0.15+zstd.1.5.7
#76 134.6    Compiling untrusted v0.9.0
#76 134.8    Compiling httparse v1.10.1
#76 135.2    Compiling cpufeatures v0.2.17
#76 149.2    Compiling url v2.5.7
#76 155.8    Compiling time-core v0.1.4
#76 156.0    Compiling num-conv v0.1.0
#76 156.2    Compiling tinyvec_macros v0.1.1
#76 156.3    Compiling powerfmt v0.2.0
#76 166.2    Compiling deranged v0.4.0
#76 168.0    Compiling tinyvec v1.10.0
#76 168.8    Compiling time-macros v0.2.22
#76 183.3    Compiling rustls-webpki v0.103.4
#76 186.7    Compiling concurrent-queue v2.5.0
#76 187.2    Compiling h2 v0.3.27
#76 207.9    Compiling webpki-***s v1.0.2
#76 208.0    Compiling rand_core v0.6.4
#76 209.1    Compiling socket2 v0.5.10
#76 210.5    Compiling iana-time-zone v0.1.63
#76 211.5    Compiling crc-catalog v2.4.0
#76 211.7    Compiling crc32fast v1.5.0
#76 212.3    Compiling local-waker v0.1.4
#76 212.4    Compiling parking v2.2.1
#76 212.7    Compiling httpdate v1.0.3
#76 213.3    Compiling alloc-no-stdlib v2.0.4
#76 213.7    Compiling zstd-safe v7.2.4
#76 214.0    Compiling foreign-types-shared v0.1.1
#76 214.1    Compiling openssl v0.10.73
#76 214.5    Compiling foreign-types v0.3.2
#76 217.7    Compiling alloc-stdlib v0.2.2
#76 217.8    Compiling sha2 v0.10.9
#76 220.3    Compiling event-listener v5.4.1
#76 220.7    Compiling crc v3.3.0
#76 221.0    Compiling time v0.3.41
#76 224.4    Compiling chrono v0.4.41
#76 227.6    Compiling rand_chacha v0.3.1
#76 229.0    Compiling webpki-***s v0.26.11
#76 229.7    Compiling futures-intrusive v0.5.0
#76 230.5    Compiling tokio-stream v0.1.17
#76 231.2    Compiling unicode-normalization v0.1.24
#76 235.8    Compiling hashlink v0.10.0
#76 238.4    Compiling crossbeam-queue v0.3.12
#76 238.6    Compiling regex v1.11.2
#76 240.5    Compiling hmac v0.12.1
#76 240.7    Compiling rand_core v0.9.3
#76 240.8    Compiling actix-rt v2.10.0
#76 241.1    Compiling either v1.15.0
#76 241.5    Compiling openssl-macros v0.1.1
#76 242.1    Compiling uuid v1.18.0
#76 243.0    Compiling unicode-xid v0.2.6
#76 243.2    Compiling native-tls v0.2.14
#76 243.5    Compiling unicode-bidi v0.3.18
#76 245.4    Compiling unicode-properties v0.1.3
#76 245.8    Compiling adler2 v2.0.1
#76 246.1    Compiling miniz_oxide v0.8.9
#76 246.4    Compiling stringprep v0.1.5
#76 247.5    Compiling sqlx-core v0.8.6
#76 248.7    Compiling derive_more-impl v2.0.1
#76 257.4    Compiling rand_chacha v0.9.0
#76 260.0    Compiling hkdf v0.12.4
#76 260.2    Compiling rand v0.8.5
#76 ...

#77 [website] exporting to image
#77 exporting layers done
#77 writing image sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a done
#77 naming to docker.io/library/digitaloceandocker-website done
#77 DONE 0.0s

#78 [frontend] resolving provenance for metadata file
#78 DONE 0.0s

#79 [website] resolving provenance for metadata file
#79 DONE 0.0s

#76 [backend builder  7/11] RUN cargo build --release
#76 268.0    Compiling brotli-decompressor v5.0.0
#76 270.4    Compiling actix-utils v3.0.1
#76 273.7    Compiling atoi v2.0.0
#76 274.2    Compiling md-5 v0.10.6
#76 274.4    Compiling bytestring v1.4.0
#76 274.7    Compiling actix-service v2.0.3
#76 274.7    Compiling cookie v0.16.2
#76 275.0    Compiling encoding_rs v0.8.35
#76 275.5    Compiling whoami v1.6.1
#76 275.9    Compiling dotenvy v0.15.7
#76 276.8    Compiling hex v0.4.3
#76 277.3    Compiling openssl-probe v0.1.6
#76 278.5    Compiling byteorder v1.5.0
#76 279.8    Compiling try-lock v0.2.5
#76 279.9    Compiling mime v0.3.17
#76 280.3    Compiling regex-lite v0.1.7
#76 280.7    Compiling home v0.5.11
#76 281.5    Compiling actix-router v0.5.3
#76 281.9    Compiling sqlx-postgres v0.8.6
#76 282.9    Compiling want v0.3.1
#76 296.4    Compiling brotli v8.0.2
#76 307.4    Compiling zstd v0.13.3
#76 308.2    Compiling flate2 v1.1.2
#76 309.5    Compiling rand v0.9.2
#76 312.5    Compiling derive_more v2.0.1
#76 312.6    Compiling local-channel v0.1.5
#76 313.2    Compiling sha1 v0.10.6
#76 313.9    Compiling serde_urlencoded v0.7.1
#76 314.4    Compiling num-integer v0.1.46
#76 314.4    Compiling http-body v0.4.6
#76 315.3    Compiling actix-codec v0.5.2
#76 316.1    Compiling inout v0.1.4
#76 317.7    Compiling pin-project-internal v1.1.10
#76 317.9    Compiling actix-macros v0.2.4
#76 320.0    Compiling language-tags v0.3.2
#76 322.5    Compiling heck v0.5.0
#76 322.9    Compiling tower-service v0.3.3
#76 323.0    Compiling utf8parse v0.2.2
#76 323.1    Compiling anstyle-parse v0.2.7
#76 323.5    Compiling hyper v0.14.32
#76 327.6    Compiling sqlx-macros-core v0.8.6
#76 329.5    Compiling actix-http v3.11.1
#76 338.2    Compiling pin-project v1.1.10
#76 345.3    Compiling cipher v0.4.4
#76 345.8    Compiling num-bigint v0.4.6
#76 347.5    Compiling tokio-native-tls v0.3.1
#76 347.7    Compiling actix-web-codegen v4.3.0
#76 349.2    Compiling actix-server v2.6.0
#76 350.9    Compiling futures-executor v0.3.31
#76 351.5    Compiling anyhow v1.0.99
#76 352.5    Compiling is_terminal_polyfill v1.70.1
#76 352.6    Compiling impl-more v0.1.9
#76 352.7    Compiling lazy_static v1.5.0
#76 352.8    Compiling anstyle-query v1.1.4
#76 353.7    Compiling colorchoice v1.0.4
#76 353.9    Compiling anstyle v1.0.11
#76 354.4    Compiling base64 v0.21.7
#76 357.7    Compiling rustls-pemfile v1.0.4
#76 358.3    Compiling anstream v0.6.20
#76 359.0    Compiling sharded-slab v0.1.7
#76 360.5    Compiling actix-web v4.11.0
#76 378.3    Compiling futures v0.3.31
#76 378.4    Compiling simple_asn1 v0.6.3
#76 380.3    Compiling hyper-tls v0.5.0
#76 380.7    Compiling blowfish v0.9.1
#76 380.9    Compiling tokio-retry v0.3.0
#76 381.2    Compiling sqlx-macros v0.8.6
#76 382.6    Compiling env_filter v0.1.3
#76 383.8    Compiling crossbeam-channel v0.5.15
#76 385.0    Compiling matchers v0.2.0
#76 385.1    Compiling pem v3.0.5
#76 386.0    Compiling combine v4.6.7
#76 394.6    Compiling tracing-log v0.2.0
#76 395.1    Compiling actix_derive v0.6.2
#76 395.7    Compiling async-trait v0.1.89
#76 396.0    Compiling socket2 v0.4.10
#76 396.8    Compiling thread_local v1.1.9
#76 397.3    Compiling ipnet v2.11.0
#76 397.5    Compiling sha1_smol v1.0.1
#76 397.9    Compiling jiff v0.2.15
#76 399.0    Compiling arc-swap v1.7.1
#76 399.5    Compiling sync_wrapper v0.1.2
#76 399.6    Compiling nu-ansi-term v0.50.1
#76 400.3    Compiling tracing-subscriber v0.3.20
#76 407.7    Compiling env_logger v0.11.8
#76 409.3    Compiling reqwest v0.11.27
#76 414.6    Compiling redis v0.24.0
#76 433.1    Compiling actix v0.13.5
#76 435.3    Compiling jsonwebtoken v9.3.1
#76 435.7    Compiling sqlx v0.8.6
#76 435.8    Compiling bcrypt v0.15.1
#76 437.5    Compiling actix-cors v0.7.1
#76 439.7    Compiling viworks-admin-backend v0.1.0 (/app)
#76 446.9     Finished `release` profile [optimized] target(s) in 7m 26s
#76 446.9 warning: the following packages contain code that will be rejected by a future version of Rust: redis v0.24.0
#76 446.9 note: to see what the problems were, use the option `--future-incompat-report`, or run `cargo report future-incompatibilities --id 1`
#76 DONE 447.2s

#80 [backend builder  6/11] RUN mkdir src && echo "fn main() {}" > src/main.rs
#80 CACHED

#81 [backend builder  5/11] COPY Cargo.toml Cargo.lock* ./
#81 CACHED

#82 [backend builder  7/11] RUN cargo build --release
#82 CACHED

#83 [backend builder  8/11] RUN rm src/main.rs
#83 DONE 0.3s

#84 [backend builder  9/11] COPY src ./src
#84 DONE 0.1s

#85 [backend builder 10/11] COPY migrations ./migrations
#85 DONE 0.0s

#86 [backend builder 11/11] RUN cargo build --release
#86 0.908     Finished `release` profile [optimized] target(s) in 0.61s
#86 0.909 warning: the following packages contain code that will be rejected by a future version of Rust: redis v0.24.0
#86 0.924 note: to see what the problems were, use the option `--future-incompat-report`, or run `cargo report future-incompatibilities --id 1`
#86 DONE 1.0s

#87 [backend stage-1 2/7] RUN apk add --no-cache     ca-certificates     dumb-init     busybox-extras     netcat-openbsd     wget     curl     tzdata     bash     postgresql-client     redis
#87 CACHED

#88 [backend stage-1 3/7] WORKDIR /app
#88 CACHED

#89 [backend stage-1 4/7] COPY --from=builder /app/target/release/viworks-admin-backend /app/app
#89 DONE 0.0s

#90 [backend stage-1 5/7] COPY --from=builder /app/migrations /app/migrations
#90 DONE 0.0s

#91 [backend stage-1 6/7] COPY ops/entrypoint.sh /app/entrypoint.sh
#91 DONE 0.0s

#92 [backend stage-1 7/7] RUN adduser -D -u 10001 appuser &&     chown -R appuser:appuser /app &&     chmod +x /app/entrypoint.sh
#92 DONE 0.2s

#93 [backend] exporting to image
#93 exporting layers 0.1s done
#93 writing image sha256:676719744fa999f1783137f35f989f7eac894f1e93e88cdb3c7c35e7e27a0957 done
#93 naming to docker.io/library/digitaloceandocker-backend done
#93 DONE 0.1s

#94 [backend] resolving provenance for metadata file
#94 DONE 0.0s
 digitaloceandocker-frontend  Built
 digitaloceandocker-website  Built
 digitaloceandocker-agent  Built
 digitaloceandocker-backend  Built
 Container viworks-redis  Creating
 Container viworks-website  Creating
 Container viworks-agent  Creating
 Container viworks-postgres  Creating
 Container viworks-redis  Created
 Container viworks-website  Created
 Container viworks-agent  Created
 Container viworks-postgres  Created
 Container viworks-backend  Creating
 Container viworks-backend  Created
 Container viworks-frontend  Creating
 Container viworks-frontend  Created
 Container viworks-nginx  Creating
 Container viworks-nginx  Created
 Container viworks-website  Starting
 Container viworks-agent  Starting
 Container viworks-postgres  Starting
 Container viworks-redis  Starting
 Container viworks-website  Started
 Container viworks-postgres  Started
 Container viworks-redis  Started
 Container viworks-postgres  Waiting
 Container viworks-redis  Waiting
 Container viworks-agent  Started
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
