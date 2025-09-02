deploy
failed 2 hours ago in 1m 21s

2s
3s
2s
1s
0s
1m 12s
Run scp -i ~/.ssh/id_ed25519 deploy.sh ${DROPLET_USER}@${DROPLET_IP}:/tmp/
🚀 Starting ViWorks Automated Deployment...
📅 Deployment started at: Tue Sep  2 16:41:57 UTC 2025
🛑 Stopping all containers gracefully...
time="2025-09-02T16:41:57Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
🛑 Force stopping any running containers...
🧹 Removing containers with specific names...
🧹 Removing orphaned containers...
time="2025-09-02T16:41:58Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
🧹 Cleaning up Docker images...
Total reclaimed space: 0B
Deleted Images:
untagged: digitaloceandocker-website:latest
deleted: sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a
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
untagged: digitaloceandocker-backend:latest
deleted: sha256:64bc87401ebfd3246a6ef152df0bb48af39488794dd5292d916a71693dedf696
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
   f589fc9..9cfc970  main       -> origin/main
HEAD is now at 9cfc970 cleanup: Remove old admin auth separation files and organize logs
🌐 Setting up two-network security architecture...
298787d953fe12ff49b7ced719a98457ef71df078df09bb252fcaedaf0eeb4ce
d3463336da73a35b51ecef48779192222b0a4e15db44ab47b972a89a059eebf3
🔨 Building and starting new containers with two-network security...
 redis Pulling 
 nginx Pulling 
 postgres Pulling 
 9824c27679d3 Already exists 
 61a7421693bd Pulling fs layer 
 9824c27679d3 Already exists 
 51a939567803 Pulling fs layer 
 6bc572a340ec Pulling fs layer 
 0368fd46e3c6 Pulling fs layer 
 4c55286bbede Pulling fs layer 
 5e28347af205 Pulling fs layer 
 311eca34042e Pulling fs layer 
 e6fe6f07e192 Pulling fs layer 
 a2cadbfeca72 Pulling fs layer 
 4f4fb700ef54 Pulling fs layer 
 a976ed7e7808 Pulling fs layer 
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
 0368fd46e3c6 Waiting 
 4c55286bbede Waiting 
 5e28347af205 Waiting 
 311eca34042e Waiting 
 e6fe6f07e192 Waiting 
 a2cadbfeca72 Waiting 
 4f4fb700ef54 Waiting 
 a976ed7e7808 Waiting 
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
 a612d38c9b48 Downloading [==================================================>]     175B/175B
 a612d38c9b48 Verifying Checksum 
 a612d38c9b48 Download complete 
 51a939567803 Downloading [>                                                  ]     12kB/1.116MB
 61a7421693bd Downloading [==================================================>]     969B/969B
 61a7421693bd Verifying Checksum 
 61a7421693bd Download complete 
 61a7421693bd Extracting [==================================================>]     969B/969B
 61a7421693bd Extracting [==================================================>]     969B/969B
 51a939567803 Verifying Checksum 
 51a939567803 Download complete 
 61a7421693bd Pull complete 
 51a939567803 Extracting [=>                                                 ]  32.77kB/1.116MB
 51a939567803 Extracting [======================================>            ]    852kB/1.116MB
 51a939567803 Extracting [==================================================>]  1.116MB/1.116MB
 51a939567803 Pull complete 
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 a612d38c9b48 Pull complete 
 901a9540064a Downloading [==================================================>]     116B/116B
 901a9540064a Verifying Checksum 
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Extracting [==================================================>]     116B/116B
 0f940631c13f Downloading [=======>                                           ]  1.369kB/9.448kB
 0f940631c13f Downloading [==================================================>]  9.448kB/9.448kB
 0f940631c13f Verifying Checksum 
 0f940631c13f Download complete 
 901a9540064a Pull complete 
 6c13c55b4b82 Downloading [>                                                  ]  536.6kB/103.9MB
 6c13c55b4b82 Downloading [===>                                               ]  6.963MB/103.9MB
 6c13c55b4b82 Downloading [====>                                              ]  9.634MB/103.9MB
 6c13c55b4b82 Downloading [=======>                                           ]  14.99MB/103.9MB
 a15854d6fd91 Downloading [==================================================>]     129B/129B
 a15854d6fd91 Verifying Checksum 
 a15854d6fd91 Download complete 
 6c13c55b4b82 Downloading [========>                                          ]  17.13MB/103.9MB
 685be96195b7 Downloading [==================================================>]     171B/171B
 685be96195b7 Verifying Checksum 
 685be96195b7 Download complete 
 6c13c55b4b82 Downloading [===========>                                       ]   24.6MB/103.9MB
 6c13c55b4b82 Downloading [===============>                                   ]  31.55MB/103.9MB
 6c13c55b4b82 Downloading [=================>                                 ]  35.82MB/103.9MB
 ce414b3fa674 Downloading [===========>                                       ]  1.369kB/5.927kB
 ce414b3fa674 Downloading [==================================================>]  5.927kB/5.927kB
 ce414b3fa674 Verifying Checksum 
 ce414b3fa674 Download complete 
 6c13c55b4b82 Downloading [===================>                               ]  41.15MB/103.9MB
 6afcd9ec0fd9 Downloading [==================================================>]     185B/185B
 6afcd9ec0fd9 Verifying Checksum 
 6afcd9ec0fd9 Download complete 
 6c13c55b4b82 Downloading [======================>                            ]  46.48MB/103.9MB
 6c13c55b4b82 Downloading [=========================>                         ]  52.36MB/103.9MB
 6c13c55b4b82 Downloading [============================>                      ]  58.77MB/103.9MB
 6c13c55b4b82 Downloading [===============================>                   ]   65.7MB/103.9MB
 6bc572a340ec Downloading [>                                                  ]  19.17kB/1.806MB
 6c13c55b4b82 Downloading [==================================>                ]  72.68MB/103.9MB
 403e3f251637 Downloading [==================================================>]     628B/628B
 403e3f251637 Verifying Checksum 
 403e3f251637 Download complete 
 6bc572a340ec Downloading [==================================================>]  1.806MB/1.806MB
 6bc572a340ec Verifying Checksum 
 6bc572a340ec Download complete 
 6bc572a340ec Extracting [>                                                  ]  32.77kB/1.806MB
 6c13c55b4b82 Downloading [====================================>              ]  75.86MB/103.9MB
 6bc572a340ec Extracting [=====================>                             ]  786.4kB/1.806MB
 6c13c55b4b82 Downloading [=======================================>           ]  82.29MB/103.9MB
 6bc572a340ec Extracting [==================================================>]  1.806MB/1.806MB
 6c13c55b4b82 Downloading [=========================================>         ]  86.04MB/103.9MB
 6c13c55b4b82 Downloading [===========================================>       ]  90.86MB/103.9MB
 7a8a46741e18 Downloading [==================================================>]     405B/405B
 7a8a46741e18 Verifying Checksum 
 7a8a46741e18 Download complete 
 6bc572a340ec Pull complete 
 6c13c55b4b82 Downloading [=============================================>     ]  94.59MB/103.9MB
 9adfbae99cb7 Downloading [==================================================>]     955B/955B
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Extracting [==================================================>]     628B/628B
 9adfbae99cb7 Verifying Checksum 
 9adfbae99cb7 Download complete 
 403e3f251637 Pull complete 
 6c13c55b4b82 Downloading [================================================>  ]    101MB/103.9MB
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 6c13c55b4b82 Verifying Checksum 
 6c13c55b4b82 Download complete 
 9adfbae99cb7 Pull complete 
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 6c13c55b4b82 Extracting [>                                                  ]  557.1kB/103.9MB
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
 a992fbc61ecc Downloading [=====================================>             ]  1.049kB/1.398kB
 a992fbc61ecc Downloading [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Verifying Checksum 
 a992fbc61ecc Download complete 
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 6c13c55b4b82 Extracting [=>                                                 ]  2.228MB/103.9MB
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Pull complete 
 cb1ff4086f82 Downloading [>                                                  ]  168.5kB/16.84MB
 6c13c55b4b82 Extracting [=>                                                 ]  3.899MB/103.9MB
 cb1ff4086f82 Downloading [=========>                                         ]  3.363MB/16.84MB
 6c13c55b4b82 Extracting [==>                                                ]  5.014MB/103.9MB
 cb1ff4086f82 Downloading [==========================>                        ]   8.88MB/16.84MB
 6c13c55b4b82 Extracting [==>                                                ]  6.128MB/103.9MB
 0368fd46e3c6 Downloading [>                                                  ]  36.88kB/3.638MB
 cb1ff4086f82 Downloading [=====================================>             ]  12.79MB/16.84MB
 cb1ff4086f82 Verifying Checksum 
 4c55286bbede Downloading [==================================================>]     950B/950B
 4c55286bbede Verifying Checksum 
 4c55286bbede Download complete 
 cb1ff4086f82 Download complete 
 0368fd46e3c6 Downloading [============================================>      ]   3.26MB/3.638MB
 0368fd46e3c6 Verifying Checksum 
 0368fd46e3c6 Download complete 
 0368fd46e3c6 Extracting [>                                                  ]  65.54kB/3.638MB
 6c13c55b4b82 Extracting [===>                                               ]  7.242MB/103.9MB
 0368fd46e3c6 Extracting [=========>                                         ]  720.9kB/3.638MB
 6c13c55b4b82 Extracting [===>                                               ]  7.799MB/103.9MB
 cb1ff4086f82 Extracting [>                                                  ]  196.6kB/16.84MB
 0368fd46e3c6 Extracting [==================>                                ]  1.376MB/3.638MB
 6c13c55b4b82 Extracting [====>                                              ]  8.356MB/103.9MB
 cb1ff4086f82 Extracting [=>                                                 ]  589.8kB/16.84MB
 0368fd46e3c6 Extracting [==============================>                    ]  2.228MB/3.638MB
 6c13c55b4b82 Extracting [====>                                              ]  8.913MB/103.9MB
 cb1ff4086f82 Extracting [====>                                              ]  1.376MB/16.84MB
 0368fd46e3c6 Extracting [========================================>          ]  2.949MB/3.638MB
 311eca34042e Downloading [>                                                  ]  10.63kB/1.003MB
 6c13c55b4b82 Extracting [====>                                              ]   9.47MB/103.9MB
 5e28347af205 Downloading [>                                                  ]  2.738kB/173.2kB
 311eca34042e Verifying Checksum 
 311eca34042e Download complete 
 e6fe6f07e192 Downloading [>                                                  ]  127.9kB/12.41MB
 5e28347af205 Verifying Checksum 
 5e28347af205 Download complete 
 cb1ff4086f82 Extracting [=====>                                             ]  1.966MB/16.84MB
 0368fd46e3c6 Extracting [=============================================>     ]  3.342MB/3.638MB
 6c13c55b4b82 Extracting [====>                                              ]  10.03MB/103.9MB
 e6fe6f07e192 Downloading [============>                                      ]  3.129MB/12.41MB
 0368fd46e3c6 Extracting [==================================================>]  3.638MB/3.638MB
 cb1ff4086f82 Extracting [=======>                                           ]  2.556MB/16.84MB
 e6fe6f07e192 Downloading [====================================>              ]  8.946MB/12.41MB
 0368fd46e3c6 Pull complete 
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Pull complete 
 e6fe6f07e192 Downloading [=================================================> ]  12.39MB/12.41MB
 e6fe6f07e192 Verifying Checksum 
 e6fe6f07e192 Download complete 
 5e28347af205 Extracting [=========>                                         ]  32.77kB/173.2kB
 6c13c55b4b82 Extracting [=====>                                             ]  11.14MB/103.9MB
 cb1ff4086f82 Extracting [=========>                                         ]  3.146MB/16.84MB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 6c13c55b4b82 Extracting [=====>                                             ]   11.7MB/103.9MB
 cb1ff4086f82 Extracting [===========>                                       ]  3.736MB/16.84MB
 4f4fb700ef54 Downloading [==================================================>]      32B/32B
 4f4fb700ef54 Verifying Checksum 
 4f4fb700ef54 Download complete 
 6c13c55b4b82 Extracting [======>                                            ]  12.81MB/103.9MB
 5e28347af205 Pull complete 
 311eca34042e Extracting [=>                                                 ]  32.77kB/1.003MB
 cb1ff4086f82 Extracting [===============>                                   ]  5.112MB/16.84MB
 a2cadbfeca72 Downloading [==================================================>]      99B/99B
 a2cadbfeca72 Verifying Checksum 
 a2cadbfeca72 Download complete 
 311eca34042e Extracting [==================================>                ]  688.1kB/1.003MB
 cb1ff4086f82 Extracting [================>                                  ]  5.702MB/16.84MB
 6c13c55b4b82 Extracting [======>                                            ]  13.93MB/103.9MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 a976ed7e7808 Downloading [==================================================>]     574B/574B
 a976ed7e7808 Verifying Checksum 
 a976ed7e7808 Download complete 
 311eca34042e Pull complete 
 e6fe6f07e192 Extracting [>                                                  ]  131.1kB/12.41MB
 cb1ff4086f82 Extracting [===================>                               ]  6.488MB/16.84MB
 e6fe6f07e192 Extracting [==>                                                ]  655.4kB/12.41MB
 6c13c55b4b82 Extracting [=======>                                           ]  15.04MB/103.9MB
 cb1ff4086f82 Extracting [=====================>                             ]  7.078MB/16.84MB
 e6fe6f07e192 Extracting [=====>                                             ]  1.442MB/12.41MB
 cb1ff4086f82 Extracting [=======================>                           ]  7.864MB/16.84MB
 6c13c55b4b82 Extracting [=======>                                           ]  16.15MB/103.9MB
 e6fe6f07e192 Extracting [========>                                          ]  2.097MB/12.41MB
 cb1ff4086f82 Extracting [=========================>                         ]  8.651MB/16.84MB
 6c13c55b4b82 Extracting [========>                                          ]  17.27MB/103.9MB
 e6fe6f07e192 Extracting [===========>                                       ]  2.753MB/12.41MB
 cb1ff4086f82 Extracting [===========================>                       ]  9.241MB/16.84MB
 e6fe6f07e192 Extracting [=============>                                     ]  3.408MB/12.41MB
 6c13c55b4b82 Extracting [=========>                                         ]  18.94MB/103.9MB
 cb1ff4086f82 Extracting [=============================>                     ]   9.83MB/16.84MB
 e6fe6f07e192 Extracting [===============>                                   ]  3.932MB/12.41MB
 6c13c55b4b82 Extracting [=========>                                         ]  20.05MB/103.9MB
 cb1ff4086f82 Extracting [===============================>                   ]  10.62MB/16.84MB
 e6fe6f07e192 Extracting [===================>                               ]  4.719MB/12.41MB
 6c13c55b4b82 Extracting [==========>                                        ]  21.17MB/103.9MB
 cb1ff4086f82 Extracting [=================================>                 ]   11.4MB/16.84MB
 e6fe6f07e192 Extracting [=====================>                             ]  5.374MB/12.41MB
 6c13c55b4b82 Extracting [==========>                                        ]  22.28MB/103.9MB
 cb1ff4086f82 Extracting [=====================================>             ]  12.58MB/16.84MB
 e6fe6f07e192 Extracting [========================>                          ]   6.16MB/12.41MB
 6c13c55b4b82 Extracting [===========>                                       ]   23.4MB/103.9MB
 cb1ff4086f82 Extracting [=======================================>           ]  13.37MB/16.84MB
 e6fe6f07e192 Extracting [===========================>                       ]  6.816MB/12.41MB
 cb1ff4086f82 Extracting [==========================================>        ]  14.16MB/16.84MB
 e6fe6f07e192 Extracting [==============================>                    ]  7.602MB/12.41MB
 6c13c55b4b82 Extracting [============>                                      ]  25.07MB/103.9MB
 e6fe6f07e192 Extracting [=================================>                 ]  8.389MB/12.41MB
 cb1ff4086f82 Extracting [============================================>      ]  14.94MB/16.84MB
 6c13c55b4b82 Extracting [============>                                      ]  26.74MB/103.9MB
 e6fe6f07e192 Extracting [====================================>              ]  9.044MB/12.41MB
 cb1ff4086f82 Extracting [==============================================>    ]  15.73MB/16.84MB
 e6fe6f07e192 Extracting [======================================>            ]  9.568MB/12.41MB
 cb1ff4086f82 Extracting [=================================================> ]  16.52MB/16.84MB
 6c13c55b4b82 Extracting [=============>                                     ]  27.85MB/103.9MB
 e6fe6f07e192 Extracting [=========================================>         ]  10.35MB/12.41MB
 cb1ff4086f82 Extracting [==================================================>]  16.84MB/16.84MB
 e6fe6f07e192 Extracting [==========================================>        ]  10.62MB/12.41MB
 cb1ff4086f82 Pull complete 
 6c13c55b4b82 Extracting [=============>                                     ]  28.97MB/103.9MB
 e6fe6f07e192 Extracting [============================================>      ]  11.01MB/12.41MB
 nginx Pulled 
 6c13c55b4b82 Extracting [==============>                                    ]  30.08MB/103.9MB
 e6fe6f07e192 Extracting [================================================>  ]  11.93MB/12.41MB
 e6fe6f07e192 Extracting [==================================================>]  12.41MB/12.41MB
 e6fe6f07e192 Pull complete 
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 6c13c55b4b82 Extracting [===============>                                   ]   31.2MB/103.9MB
 a2cadbfeca72 Pull complete 
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Pull complete 
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 6c13c55b4b82 Extracting [================>                                  ]  33.42MB/103.9MB
 a976ed7e7808 Pull complete 
 redis Pulled 
 6c13c55b4b82 Extracting [================>                                  ]  35.09MB/103.9MB
 6c13c55b4b82 Extracting [=================>                                 ]  36.77MB/103.9MB
 6c13c55b4b82 Extracting [==================>                                ]  38.99MB/103.9MB
 6c13c55b4b82 Extracting [===================>                               ]  41.22MB/103.9MB
 6c13c55b4b82 Extracting [=====================>                             ]  44.01MB/103.9MB
 6c13c55b4b82 Extracting [======================>                            ]  46.79MB/103.9MB
 6c13c55b4b82 Extracting [=======================>                           ]  49.02MB/103.9MB
 6c13c55b4b82 Extracting [========================>                          ]  50.69MB/103.9MB
 6c13c55b4b82 Extracting [========================>                          ]  51.81MB/103.9MB
 6c13c55b4b82 Extracting [=========================>                         ]  53.48MB/103.9MB
 6c13c55b4b82 Extracting [==========================>                        ]  55.15MB/103.9MB
 6c13c55b4b82 Extracting [===========================>                       ]  56.82MB/103.9MB
 6c13c55b4b82 Extracting [============================>                      ]  59.05MB/103.9MB
 6c13c55b4b82 Extracting [=============================>                     ]  61.28MB/103.9MB
 6c13c55b4b82 Extracting [==============================>                    ]   63.5MB/103.9MB
 6c13c55b4b82 Extracting [===============================>                   ]  65.73MB/103.9MB
 6c13c55b4b82 Extracting [================================>                  ]  67.96MB/103.9MB
 6c13c55b4b82 Extracting [==================================>                ]  70.75MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  73.53MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.65MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]   75.2MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]  75.76MB/103.9MB
 6c13c55b4b82 Extracting [=====================================>             ]  77.43MB/103.9MB
 6c13c55b4b82 Extracting [=====================================>             ]  78.54MB/103.9MB
 6c13c55b4b82 Extracting [======================================>            ]  80.22MB/103.9MB
 6c13c55b4b82 Extracting [=======================================>           ]  81.89MB/103.9MB
 6c13c55b4b82 Extracting [========================================>          ]  84.12MB/103.9MB
 6c13c55b4b82 Extracting [=========================================>         ]  85.23MB/103.9MB
 6c13c55b4b82 Extracting [==========================================>        ]  87.46MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]  89.69MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]   90.8MB/103.9MB
 6c13c55b4b82 Extracting [============================================>      ]  93.03MB/103.9MB
 6c13c55b4b82 Extracting [=============================================>     ]  95.26MB/103.9MB
 6c13c55b4b82 Extracting [===============================================>   ]   98.6MB/103.9MB
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
#1 reading from stdin 1.49kB done
#1 DONE 0.0s

#2 [backend internal] load build definition from Dockerfile.fixed
#2 transferring dockerfile: 1.87kB done
#2 WARN: FromAsCasing: 'as' and 'FROM' keywords' casing do not match (line 2)
#2 DONE 0.0s

#3 [website internal] load build definition from Dockerfile
#3 transferring dockerfile: 2.04kB done
#3 DONE 0.1s

#4 [frontend internal] load build definition from Dockerfile
#4 transferring dockerfile: 1.58kB done
#4 DONE 0.1s

#5 [frontend internal] load metadata for docker.io/library/node:22-alpine
#5 ...

#6 [backend internal] load metadata for docker.io/library/rust:1.89.0-alpine
#6 DONE 0.4s

#7 [backend internal] load metadata for docker.io/library/alpine:3.22
#7 DONE 0.4s

#8 [website internal] load metadata for docker.io/library/node:18-alpine
#8 DONE 0.4s

#5 [frontend internal] load metadata for docker.io/library/node:22-alpine
#5 DONE 0.4s

#9 [backend internal] load .dockerignore
#9 transferring context: 2B done
#9 DONE 0.0s

#10 [website internal] load .dockerignore
#10 transferring context: 2B done
#10 DONE 0.0s

#11 [backend stage-1 1/7] FROM docker.io/library/alpine:3.22@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#11 DONE 0.0s

#12 [backend builder  1/11] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#12 DONE 0.0s

#13 [website base 1/1] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#13 DONE 0.0s

#14 [frontend internal] load .dockerignore
#14 transferring context: 2B 0.0s done
#14 DONE 0.1s

#15 [website internal] load build context
#15 transferring context: 7.37kB done
#15 DONE 0.0s

#16 [frontend builder 1/7] FROM docker.io/library/node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9
#16 DONE 0.0s

#17 [backend internal] load build context
#17 transferring context: 6.41kB 0.0s done
#17 DONE 0.0s

#18 [backend builder  2/11] WORKDIR /app
#18 CACHED

#19 [backend builder  3/11] RUN apk add --no-cache     pkgconfig     openssl-dev     postgresql-dev     musl-dev     gcc     curl
#19 CACHED

#20 [backend builder  4/11] RUN rustup target add x86_64-unknown-linux-musl
#20 CACHED

#21 [website runner 4/8] COPY --from=builder /app/public ./public
#21 CACHED

#22 [website runner 2/8] RUN addgroup --system --gid 1001 nodejs
#22 CACHED

#23 [website builder 3/5] COPY . .
#23 CACHED

#24 [website runner 5/8] RUN mkdir .next
#24 CACHED

#25 [website runner 3/8] RUN adduser --system --uid 1001 nextjs
#25 CACHED

#26 [website runner 6/8] RUN chown nextjs:nodejs .next
#26 CACHED

#27 [website deps 3/4] COPY package.json pnpm-lock.yaml* ./
#27 CACHED

#28 [website runner 7/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#28 CACHED

#29 [website builder 5/5] RUN npm run build
#29 CACHED

#30 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#30 CACHED

#31 [website deps 2/4] WORKDIR /app
#31 CACHED

#32 [website builder 4/5] RUN mkdir -p public
#32 CACHED

#33 [website builder 1/5] WORKDIR /app
#33 CACHED

#34 [website builder 2/5] COPY --from=deps /app/node_modules ./node_modules
#34 CACHED

#35 [website deps 1/4] RUN apk add --no-cache libc6-compat
#35 CACHED

#36 [website runner 8/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#36 CACHED

#37 [website] exporting to image
#37 exporting layers done
#37 writing image sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a 0.0s done
#37 naming to docker.io/library/digitaloceandocker-website
#37 naming to docker.io/library/digitaloceandocker-website 0.0s done
#37 DONE 0.1s

#38 [frontend internal] load build context
#38 transferring context: 1.34MB 0.2s done
#38 DONE 0.7s

#39 [backend builder  5/11] COPY Cargo.toml Cargo.lock* ./
#39 ...

#40 [frontend builder 5/7] RUN npm install
#40 CACHED

#41 [frontend builder 5/7] RUN npm install
#41 CACHED

#42 [frontend builder 2/7] WORKDIR /app
#42 CACHED

#43 [frontend builder 4/7] COPY package*.json ./
#43 CACHED

#44 [frontend builder 3/7] RUN apk add --no-cache python3 make g++
#44 CACHED

#39 [backend builder  5/11] COPY Cargo.toml Cargo.lock* ./
#39 DONE 0.8s

#45 [frontend builder 6/7] COPY . .
#45 DONE 0.3s

#46 [website] resolving provenance for metadata file
#46 DONE 0.0s

#47 [backend builder  6/11] RUN mkdir src && echo "fn main() {}" > src/main.rs
#47 DONE 0.5s

#48 [backend builder  7/11] RUN cargo build --release
#48 0.636     Updating crates.io index
#48 2.411  Downloading crates ...
#48 2.514   Downloaded anstyle-query v1.1.4
#48 2.538   Downloaded futures v0.3.31
#48 2.576   Downloaded digest v0.10.7
#48 2.603   Downloaded tower-service v0.3.3
#48 2.614   Downloaded matchers v0.2.0
#48 2.627   Downloaded md-5 v0.10.6
#48 2.647   Downloaded rand_chacha v0.3.1
#48 2.657   Downloaded scopeguard v1.2.0
#48 2.665   Downloaded ryu v1.0.20
#48 2.679   Downloaded miniz_oxide v0.8.9
#48 2.689   Downloaded rustls-webpki v0.103.4
#48 2.700   Downloaded rsa v0.9.8
#48 2.714   Downloaded regex v1.11.2
#48 2.736   Downloaded libm v0.2.15
#48 2.758   Downloaded idna v1.1.0
#48 2.769   Downloaded hyper v0.14.32
#48 2.786   Downloaded icu_properties_data v2.0.1
#48 2.805   Downloaded regex-lite v0.1.7
#48 2.814   Downloaded regex-syntax v0.8.6
#48 2.830   Downloaded zerocopy v0.8.26
#48 2.871   Downloaded redis v0.24.0
#48 2.887   Downloaded webpki-***s v1.0.2
#48 2.896   Downloaded syn v2.0.106
#48 2.917   Downloaded vcpkg v0.2.15
#48 3.002   Downloaded tracing-subscriber v0.3.20
#48 3.019   Downloaded sqlx v0.8.6
#48 3.046   Downloaded regex-automata v0.4.10
#48 3.077   Downloaded unicode-normalization v0.1.24
#48 3.085   Downloaded sqlx-postgres v0.8.6
#48 3.098   Downloaded rand v0.9.2
#48 3.106   Downloaded rand v0.8.5
#48 3.112   Downloaded serde_json v1.0.143
#48 3.125   Downloaded serde v1.0.219
#48 3.132   Downloaded openssl-sys v0.9.109
#48 3.142   Downloaded openssl v0.10.73
#48 3.158   Downloaded zerovec v0.11.4
#48 3.169   Downloaded tokio-util v0.7.16
#48 3.184   Downloaded time v0.3.41
#48 3.208   Downloaded rustls-pki-types v1.12.0
#48 3.216   Downloaded rustls v0.23.31
#48 3.244   Downloaded num-bigint-dig v0.8.4
#48 3.257   Downloaded num-bigint v0.4.6
#48 3.266   Downloaded mio v1.0.4
#48 3.278   Downloaded memchr v2.7.5
#48 3.290   Downloaded jiff v0.2.15
#48 3.320   Downloaded indexmap v2.11.0
#48 3.328   Downloaded zerotrie v0.2.2
#48 3.335   Downloaded libc v0.2.175
#48 3.389   Downloaded zstd-sys v2.0.15+zstd.1.5.7
#48 3.420   Downloaded sqlx-core v0.8.6
#48 3.435   Downloaded tokio v1.47.1
#48 3.499   Downloaded icu_collections v2.0.0
#48 3.510   Downloaded typenum v1.18.0
#48 3.516   Downloaded tracing v0.1.41
#48 3.525   Downloaded sqlx-mysql v0.8.6
#48 3.535   Downloaded rustls-pemfile v1.0.4
#48 3.539   Downloaded rand_core v0.9.3
#48 3.543   Downloaded rand_core v0.6.4
#48 3.546   Downloaded quote v1.0.40
#48 3.551   Downloaded jsonwebtoken v9.3.1
#48 3.558   Downloaded ring v0.17.14
#48 3.636   Downloaded reqwest v0.11.27
#48 3.649   Downloaded icu_properties v2.0.1
#48 3.654   Downloaded icu_normalizer_data v2.0.0
#48 3.658   Downloaded icu_normalizer v2.0.0
#48 3.665   Downloaded icu_locale_core v2.0.0
#48 3.675   Downloaded uuid v1.18.0
#48 3.681   Downloaded url v2.5.7
#48 3.686   Downloaded unicode-bidi v0.3.18
#48 3.692   Downloaded tracing-core v0.1.34
#48 3.697   Downloaded sqlx-sqlite v0.8.6
#48 3.705   Downloaded rand_chacha v0.9.0
#48 3.709   Downloaded proc-macro2 v1.0.101
#48 3.713   Downloaded ppv-lite86 v0.2.21
#48 3.717   Downloaded powerfmt v0.2.0
#48 3.719   Downloaded potential_utf v0.1.3
#48 3.722   Downloaded pkg-config v0.3.32
#48 3.725   Downloaded pkcs8 v0.10.2
#48 3.730   Downloaded pkcs1 v0.7.5
#48 3.734   Downloaded pin-utils v0.1.0
#48 3.737   Downloaded pin-project-lite v0.2.16
#48 3.748   Downloaded pin-project-internal v1.1.10
#48 3.751   Downloaded pin-project v1.1.10
#48 3.773   Downloaded percent-encoding v2.3.2
#48 3.775   Downloaded pem-rfc7468 v0.7.0
#48 3.779   Downloaded pem v3.0.5
#48 3.782   Downloaded parking_lot_core v0.9.11
#48 3.788   Downloaded parking_lot v0.12.4
#48 3.795   Downloaded smallvec v1.15.1
#48 3.801   Downloaded slab v0.4.11
#48 3.804   Downloaded simple_asn1 v0.6.3
#48 3.807   Downloaded signature v2.2.0
#48 3.810   Downloaded signal-hook-registry v1.4.6
#48 3.813   Downloaded shlex v1.3.0
#48 3.816   Downloaded sharded-slab v0.1.7
#48 3.822   Downloaded sha2 v0.10.9
#48 3.827   Downloaded sha1_smol v1.0.1
#48 3.830   Downloaded sha1 v0.10.6
#48 3.835   Downloaded serde_urlencoded v0.7.1
#48 3.839   Downloaded serde_derive v1.0.219
#48 3.846   Downloaded parking v2.2.1
#48 3.849   Downloaded openssl-probe v0.1.6
#48 3.852   Downloaded openssl-macros v0.1.1
#48 3.853   Downloaded once_cell v1.21.3
#48 3.858   Downloaded num-traits v0.2.19
#48 3.863   Downloaded num-integer v0.1.46
#48 3.866   Downloaded nu-ansi-term v0.50.1
#48 3.873   Downloaded mime v0.3.17
#48 3.876   Downloaded log v0.4.27
#48 3.884   Downloaded litemap v0.8.0
#48 3.889   Downloaded language-tags v0.3.2
#48 3.893   Downloaded ipnet v2.11.0
#48 3.898   Downloaded icu_provider v2.0.0
#48 3.904   Downloaded zstd v0.13.3
#48 3.914   Downloaded unicode-properties v0.1.3
#48 3.918   Downloaded tracing-attributes v0.1.30
#48 3.925   Downloaded tinyvec v1.10.0
#48 3.932   Downloaded thiserror v2.0.16
#48 3.943   Downloaded num-iter v0.1.45
#48 3.946   Downloaded num-conv v0.1.0
#48 3.948   Downloaded native-tls v0.2.14
#48 3.953   Downloaded lock_api v0.4.13
#48 3.956   Downloaded local-channel v0.1.5
#48 3.958   Downloaded lazy_static v1.5.0
#48 3.962   Downloaded jobserver v0.1.34
#48 3.966   Downloaded itoa v1.0.15
#48 3.973   Downloaded is_terminal_polyfill v1.70.1
#48 3.976   Downloaded inout v0.1.4
#48 3.979   Downloaded impl-more v0.1.9
#48 3.983   Downloaded iana-time-zone v0.1.63
#48 3.992   Downloaded zstd-safe v7.2.4
#48 3.996   Downloaded zerovec-derive v0.11.1
#48 4.000   Downloaded zeroize v1.8.1
#48 4.003   Downloaded zerofrom-derive v0.1.6
#48 4.005   Downloaded yoke-derive v0.8.0
#48 4.008   Downloaded yoke v0.8.0
#48 4.012   Downloaded writeable v0.6.1
#48 4.015   Downloaded utf8parse v0.2.2
#48 4.018   Downloaded untrusted v0.9.0
#48 4.021   Downloaded unicode-ident v1.0.18
#48 4.027   Downloaded tokio-stream v0.1.17
#48 4.034   Downloaded tokio-macros v2.5.0
#48 4.036   Downloaded time-macros v0.2.22
#48 4.040   Downloaded thread_local v1.1.9
#48 4.043   Downloaded encoding_rs v0.8.35
#48 4.086   Downloaded brotli v8.0.2
#48 4.115   Downloaded local-waker v0.1.4
#48 4.117   Downloaded idna_adapter v1.2.1
#48 4.119   Downloaded hyper-tls v0.5.0
#48 4.122   Downloaded whoami v1.6.1
#48 4.126   Downloaded webpki-***s v0.26.11
#48 4.129   Downloaded version_check v0.9.5
#48 4.132   Downloaded utf8_iter v1.0.4
#48 4.135   Downloaded unicode-xid v0.2.6
#48 4.141   Downloaded tracing-log v0.2.0
#48 4.146   Downloaded tokio-native-tls v0.3.1
#48 4.151   Downloaded tinystr v0.8.1
#48 4.157   Downloaded time-core v0.1.4
#48 4.160   Downloaded synstructure v0.13.2
#48 4.163   Downloaded httpdate v1.0.3
#48 4.166   Downloaded hkdf v0.12.4
#48 4.173   Downloaded hashbrown v0.15.5
#48 4.185   Downloaded h2 v0.3.27
#48 4.197   Downloaded futures-util v0.3.31
#48 4.216   Downloaded futures-intrusive v0.5.0
#48 4.224   Downloaded chrono v0.4.41
#48 4.237   Downloaded brotli-decompressor v5.0.0
#48 4.248   Downloaded actix-web v4.11.0
#48 4.268   Downloaded zerofrom v0.1.6
#48 4.271   Downloaded want v0.3.1
#48 4.273   Downloaded try-lock v0.2.5
#48 4.275   Downloaded thiserror-impl v2.0.16
#48 4.278   Downloaded sync_wrapper v0.1.2
#48 4.280   Downloaded subtle v2.6.1
#48 4.282   Downloaded stringprep v0.1.5
#48 4.286   Downloaded stable_deref_trait v1.2.0
#48 4.288   Downloaded sqlx-macros-core v0.8.6
#48 4.292   Downloaded spki v0.7.3
#48 4.295   Downloaded spin v0.9.8
#48 4.300   Downloaded socket2 v0.6.0
#48 4.304   Downloaded socket2 v0.5.10
#48 4.308   Downloaded socket2 v0.4.10
#48 4.311   Downloaded httparse v1.10.1
#48 4.317   Downloaded http v0.2.12
#48 4.323   Downloaded hmac v0.12.1
#48 4.327   Downloaded hashlink v0.10.0
#48 4.330   Downloaded getrandom v0.3.3
#48 4.337   Downloaded getrandom v0.2.16
#48 4.342   Downloaded futures-executor v0.3.31
#48 4.346   Downloaded futures-channel v0.3.31
#48 4.350   Downloaded flume v0.11.1
#48 4.357   Downloaded flate2 v1.1.2
#48 4.366   Downloaded event-listener v5.4.1
#48 4.371   Downloaded env_logger v0.11.8
#48 4.377   Downloaded derive_more-impl v2.0.1
#48 4.385   Downloaded derive_more v2.0.1
#48 4.400   Downloaded der v0.7.10
#48 4.408   Downloaded crossbeam-utils v0.8.21
#48 4.414   Downloaded crossbeam-channel v0.5.15
#48 4.422   Downloaded combine v4.6.7
#48 4.433   Downloaded cc v1.2.34
#48 4.440   Downloaded aho-corasick v1.1.3
#48 4.448   Downloaded actix-http v3.11.1
#48 4.462   Downloaded tokio-retry v0.3.0
#48 4.465   Downloaded tinyvec_macros v0.1.1
#48 4.467   Downloaded sqlx-macros v0.8.6
#48 4.469   Downloaded http-body v0.4.6
#48 4.472   Downloaded home v0.5.11
#48 4.474   Downloaded hex v0.4.3
#48 4.477   Downloaded heck v0.5.0
#48 4.480   Downloaded generic-array v0.14.7
#48 4.483   Downloaded futures-task v0.3.31
#48 4.486   Downloaded futures-sink v0.3.31
#48 4.488   Downloaded futures-macro v0.3.31
#48 4.491   Downloaded futures-io v0.3.31
#48 4.493   Downloaded futures-core v0.3.31
#48 4.497   Downloaded form_urlencoded v1.2.2
#48 4.499   Downloaded foreign-types-shared v0.1.1
#48 4.501   Downloaded foreign-types v0.3.2
#48 4.504   Downloaded foldhash v0.1.5
#48 4.525   Downloaded fnv v1.0.7
#48 4.525   Downloaded equivalent v1.0.2
#48 4.533   Downloaded env_filter v0.1.3
#48 4.533   Downloaded either v1.15.0
#48 4.533   Downloaded dotenvy v0.15.7
#48 4.545   Downloaded displaydoc v0.2.5
#48 4.550   Downloaded deranged v0.4.0
#48 4.568   Downloaded crypto-common v0.1.6
#48 4.568   Downloaded crossbeam-queue v0.3.12
#48 4.568   Downloaded crc32fast v1.5.0
#48 4.568   Downloaded crc-catalog v2.4.0
#48 4.584   Downloaded crc v3.3.0
#48 4.584   Downloaded cpufeatures v0.2.17
#48 4.584   Downloaded const-oid v0.9.6
#48 4.584   Downloaded concurrent-queue v2.5.0
#48 4.589   Downloaded colorchoice v1.0.4
#48 4.591   Downloaded cipher v0.4.4
#48 4.595   Downloaded cfg-if v1.0.3
#48 4.597   Downloaded bytestring v1.4.0
#48 4.601   Downloaded bytes v1.10.1
#48 4.611   Downloaded blowfish v0.9.1
#48 4.614   Downloaded bitflags v2.9.3
#48 4.621   Downloaded bcrypt v0.15.1
#48 4.623   Downloaded base64ct v1.8.0
#48 4.628   Downloaded base64 v0.22.1
#48 4.636   Downloaded base64 v0.21.7
#48 4.643   Downloaded async-trait v0.1.89
#48 4.649   Downloaded arc-swap v1.7.1
#48 4.657   Downloaded anyhow v1.0.99
#48 4.665   Downloaded anstyle v1.0.11
#48 4.668   Downloaded allocator-api2 v0.2.21
#48 4.673   Downloaded actix-server v2.6.0
#48 4.679   Downloaded actix v0.13.5
#48 4.688   Downloaded byteorder v1.5.0
#48 4.692   Downloaded block-buffer v0.10.4
#48 4.694   Downloaded autocfg v1.5.0
#48 4.698   Downloaded atoi v2.0.0
#48 4.700   Downloaded anstyle-parse v0.2.7
#48 4.704   Downloaded anstream v0.6.20
#48 4.709   Downloaded alloc-no-stdlib v2.0.4
#48 4.712   Downloaded adler2 v2.0.1
#48 4.715   Downloaded actix_derive v0.6.2
#48 4.718   Downloaded actix-web-codegen v4.3.0
#48 4.723   Downloaded actix-utils v3.0.1
#48 4.725   Downloaded actix-service v2.0.3
#48 4.729   Downloaded actix-rt v2.10.0
#48 4.733   Downloaded actix-router v0.5.3
#48 4.737   Downloaded actix-macros v0.2.4
#48 4.740   Downloaded actix-cors v0.7.1
#48 4.744   Downloaded actix-codec v0.5.2
#48 4.748   Downloaded cookie v0.16.2
#48 4.753   Downloaded alloc-stdlib v0.2.2
#48 4.758   Downloaded libsqlite3-sys v0.30.1
#48 5.193    Compiling proc-macro2 v1.0.101
#48 5.194    Compiling unicode-ident v1.0.18
#48 5.529    Compiling libc v0.2.175
#48 6.912    Compiling serde v1.0.219
#48 ...

#49 [frontend builder 7/7] RUN echo "Starting build process..." &&     npm run build &&     echo "Build completed. Checking standalone output..." &&     ls -la .next/ &&     ls -la .next/standalone/ || echo "Standalone directory not found!" &&     echo "Build verification complete."
#49 0.360 Starting build process...
#49 0.695 
#49 0.695 > frontend@0.1.0 build
#49 0.695 > next build
#49 0.695 
#49 2.385 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#49 2.386 This information is used to shape Next.js' roadmap and prioritize features.
#49 2.386 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#49 2.386 https://nextjs.org/telemetry
#49 2.387 
#49 2.514    ▲ Next.js 15.5.2
#49 2.515 
#49 2.720    Creating an optimized production build ...
#49 ...

#48 [backend builder  7/11] RUN cargo build --release
#48 9.935    Compiling quote v1.0.40
#48 11.38    Compiling syn v2.0.106
#48 11.69    Compiling cfg-if v1.0.3
#48 11.78    Compiling autocfg v1.5.0
#48 17.69    Compiling jobserver v0.1.34
#48 19.08    Compiling shlex v1.3.0
#48 19.74    Compiling cc v1.2.34
#48 27.26    Compiling version_check v0.9.5
#48 28.45    Compiling typenum v1.18.0
#48 29.58    Compiling synstructure v0.13.2
#48 31.93    Compiling generic-array v0.14.7
#48 32.46    Compiling lock_api v0.4.13
#48 33.14    Compiling parking_lot_core v0.9.11
#48 33.90    Compiling pin-project-lite v0.2.16
#48 34.14    Compiling log v0.4.27
#48 35.20    Compiling memchr v2.7.5
#48 38.50    Compiling serde_derive v1.0.219
#48 ...

#49 [frontend builder 7/7] RUN echo "Starting build process..." &&     npm run build &&     echo "Build completed. Checking standalone output..." &&     ls -la .next/ &&     ls -la .next/standalone/ || echo "Standalone directory not found!" &&     echo "Build verification complete."
#49 39.36  ✓ Compiled successfully in 36.4s
#49 39.38    Skipping validation of types
#49 39.38    Skipping linting
#49 40.07    Collecting page data ...
#49 44.85    Generating static pages (0/9) ...
#49 48.15    Generating static pages (2/9) 
#49 48.97 Error occurred prerendering page "/_not-found". Read more: https://nextjs.org/docs/messages/prerender-error
#49 48.97 Error: useAuth must be used within an AuthProvider
#49 48.97     at <unknown> (.next/server/chunks/451.js:1:2220)
#49 48.97     at h (.next/server/chunks/451.js:1:2283) {
#49 48.97   digest: '51822283'
#49 48.97 }
#49 48.97 Export encountered an error on /_not-found/page: /_not-found, exiting the build.
#49 49.03  ⨯ Next.js build worker exited with code: 1 and signal: null
#49 49.25 Standalone directory not found!
#49 49.25 Build verification complete.
#49 DONE 49.5s

#48 [backend builder  7/11] RUN cargo build --release
#48 39.68    Compiling zerofrom-derive v0.1.6
#48 46.72    Compiling yoke-derive v0.8.0
#48 ...

#50 [frontend runner 4/7] WORKDIR /app
#50 CACHED

#51 [frontend runner 2/7] RUN apk add --no-cache dumb-init
#51 CACHED

#52 [frontend runner 3/7] RUN addgroup -g 1001 -S nodejs &&     adduser -u 1001 -S nextjs -G nodejs
#52 CACHED

#53 [frontend runner 5/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#53 ERROR: failed to calculate checksum of ref 24b779ce-0862-405d-bf2d-4a3a81d1be9a::vh4z20g6l1rwwep9vcpla4tls: "/app/.next/standalone": not found

#48 [backend builder  7/11] RUN cargo build --release
#48 CANCELED
------
Dockerfile:41
 > [frontend runner 5/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./:
------

--------------------

  39 |     

  40 |     # Copy built application from builder stage

  41 | >>> COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

  42 |     COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

  43 |     

--------------------

target frontend: failed to solve: failed to compute cache key: failed to calculate checksum of ref 24b779ce-0862-405d-bf2d-4a3a81d1be9a::vh4z20g6l1rwwep9vcpla4tls: "/app/.next/standalone": not found

Error: Process completed with exit code 1.
0s
0s
0s
