deploy
failed now in 1m 59s

1s
1s
2s
2s
0s
1m 50s
Run scp -i ~/.ssh/id_ed25519 deploy.sh ${DROPLET_USER}@${DROPLET_IP}:/tmp/
🚀 Starting ViWorks Automated Deployment...
📅 Deployment started at: Tue Sep  2 18:48:43 UTC 2025
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
time="2025-09-02T18:48:44Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
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
deleted: sha256:7c27e556b0091b44fb79532932f64526b92882d0bdf932deaf4208059dbfc795
untagged: digitaloceandocker-backend:latest
deleted: sha256:676719744fa999f1783137f35f989f7eac894f1e93e88cdb3c7c35e7e27a0957
Total reclaimed space: 351MB
🧹 Cleaning up unused networks...
Deleted Networks:
viworks-public
viworks-internal
🔍 Verifying no conflicting containers exist...
🧹 Cleaning up and resetting git repository...
From https://github.com/apebrahimi/viworkdemo002
   e05af21..024736f  main       -> origin/main
HEAD is now at 024736f fix: Remove old AuthContext to resolve build errors
🌐 Setting up two-network security architecture...
b92fe5bc024806c0002999b5950024668a20147b5a3412ee4b36a291cf96dbb6
b8f5f0e965a21b397c794609d25654b4d81a91bd07897f14402bc694fba94117
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
 6bc572a340ec Waiting 
 403e3f251637 Waiting 
 9adfbae99cb7 Waiting 
 a612d38c9b48 Downloading [==================================================>]     175B/175B
 a612d38c9b48 Verifying Checksum 
 a612d38c9b48 Download complete 
 51a939567803 Downloading [>                                                  ]  12.32kB/1.116MB
 61a7421693bd Downloading [==================================================>]     969B/969B
 61a7421693bd Verifying Checksum 
 61a7421693bd Download complete 
 61a7421693bd Extracting [==================================================>]     969B/969B
 61a7421693bd Extracting [==================================================>]     969B/969B
 51a939567803 Download complete 
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
 6c13c55b4b82 Downloading [===>                                               ]   6.98MB/103.9MB
 6c13c55b4b82 Downloading [=====>                                             ]   11.8MB/103.9MB
 6c13c55b4b82 Downloading [=======>                                           ]  16.58MB/103.9MB
 a15854d6fd91 Downloading [==================================================>]     129B/129B
 a15854d6fd91 Verifying Checksum 
 a15854d6fd91 Download complete 
 6c13c55b4b82 Downloading [===========>                                       ]  23.52MB/103.9MB
 685be96195b7 Downloading [==================================================>]     171B/171B
 685be96195b7 Verifying Checksum 
 685be96195b7 Download complete 
 6c13c55b4b82 Downloading [===============>                                   ]  31.51MB/103.9MB
 6c13c55b4b82 Downloading [==================>                                ]  38.98MB/103.9MB
 6c13c55b4b82 Downloading [=====================>                             ]  44.32MB/103.9MB
 ce414b3fa674 Downloading [========>                                          ]  1.049kB/5.927kB
 ce414b3fa674 Downloading [==================================================>]  5.927kB/5.927kB
 ce414b3fa674 Verifying Checksum 
 ce414b3fa674 Download complete 
 6c13c55b4b82 Downloading [=======================>                           ]  48.58MB/103.9MB
 6afcd9ec0fd9 Downloading [==================================================>]     185B/185B
 6afcd9ec0fd9 Verifying Checksum 
 6afcd9ec0fd9 Download complete 
 6c13c55b4b82 Downloading [=========================>                         ]  53.92MB/103.9MB
 6c13c55b4b82 Downloading [===========================>                       ]  57.13MB/103.9MB
 6c13c55b4b82 Downloading [==============================>                    ]  62.47MB/103.9MB
 6c13c55b4b82 Downloading [================================>                  ]  68.31MB/103.9MB
 6bc572a340ec Downloading [>                                                  ]  18.84kB/1.806MB
 403e3f251637 Downloading [==================================================>]     628B/628B
 403e3f251637 Verifying Checksum 
 403e3f251637 Download complete 
 6bc572a340ec Verifying Checksum 
 6bc572a340ec Download complete 
 6bc572a340ec Extracting [>                                                  ]  32.77kB/1.806MB
 6c13c55b4b82 Downloading [===================================>               ]  74.18MB/103.9MB
 6bc572a340ec Extracting [=======================================>           ]  1.409MB/1.806MB
 6c13c55b4b82 Downloading [======================================>            ]  78.99MB/103.9MB
 6bc572a340ec Extracting [==================================================>]  1.806MB/1.806MB
 6c13c55b4b82 Downloading [========================================>          ]   83.8MB/103.9MB
 6bc572a340ec Pull complete 
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Pull complete 
 6c13c55b4b82 Downloading [=========================================>         ]  86.99MB/103.9MB
 6c13c55b4b82 Downloading [============================================>      ]  92.33MB/103.9MB
 7a8a46741e18 Downloading [==================================================>]     405B/405B
 7a8a46741e18 Verifying Checksum 
 7a8a46741e18 Download complete 
 9adfbae99cb7 Downloading [==================================================>]     955B/955B
 9adfbae99cb7 Verifying Checksum 
 9adfbae99cb7 Download complete 
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 6c13c55b4b82 Downloading [===============================================>   ]  99.24MB/103.9MB
 9adfbae99cb7 Pull complete 
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 7a8a46741e18 Pull complete 
 6c13c55b4b82 Verifying Checksum 
 6c13c55b4b82 Download complete 
 6c13c55b4b82 Extracting [>                                                  ]  557.1kB/103.9MB
 6c13c55b4b82 Extracting [=>                                                 ]  2.228MB/103.9MB
 6c13c55b4b82 Extracting [==>                                                ]  5.571MB/103.9MB
 c9ebe2ff2d2c Downloading [===========================================>       ]  1.049kB/1.209kB
 c9ebe2ff2d2c Downloading [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Verifying Checksum 
 c9ebe2ff2d2c Download complete 
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 a992fbc61ecc Downloading [=====================================>             ]  1.049kB/1.398kB
 a992fbc61ecc Downloading [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Verifying Checksum 
 a992fbc61ecc Download complete 
 6c13c55b4b82 Extracting [====>                                              ]  8.913MB/103.9MB
 c9ebe2ff2d2c Pull complete 
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 cb1ff4086f82 Downloading [>                                                  ]  172.2kB/16.84MB
 a992fbc61ecc Pull complete 
 6c13c55b4b82 Extracting [=====>                                             ]   11.7MB/103.9MB
 cb1ff4086f82 Downloading [==============>                                    ]  4.751MB/16.84MB
 6c13c55b4b82 Extracting [======>                                            ]  14.48MB/103.9MB
 cb1ff4086f82 Downloading [============================>                      ]  9.523MB/16.84MB
 6c13c55b4b82 Extracting [========>                                          ]  17.27MB/103.9MB
 4c55286bbede Downloading [==================================================>]     950B/950B
 4c55286bbede Verifying Checksum 
 4c55286bbede Download complete 
 0368fd46e3c6 Downloading [>                                                  ]  36.88kB/3.638MB
 6c13c55b4b82 Extracting [=========>                                         ]  20.61MB/103.9MB
 cb1ff4086f82 Downloading [=====================================>             ]  12.54MB/16.84MB
 0368fd46e3c6 Verifying Checksum 
 0368fd46e3c6 Download complete 
 0368fd46e3c6 Extracting [>                                                  ]  65.54kB/3.638MB
 cb1ff4086f82 Verifying Checksum 
 cb1ff4086f82 Download complete 
 cb1ff4086f82 Extracting [>                                                  ]  196.6kB/16.84MB
 0368fd46e3c6 Extracting [==========>                                        ]  786.4kB/3.638MB
 6c13c55b4b82 Extracting [==========>                                        ]  22.28MB/103.9MB
 6c13c55b4b82 Extracting [===========>                                       ]   23.4MB/103.9MB
 0368fd46e3c6 Extracting [===================>                               ]  1.442MB/3.638MB
 cb1ff4086f82 Extracting [==>                                                ]  786.4kB/16.84MB
 0368fd46e3c6 Extracting [=====================================>             ]  2.753MB/3.638MB
 6c13c55b4b82 Extracting [===========>                                       ]  24.51MB/103.9MB
 cb1ff4086f82 Extracting [======>                                            ]  2.163MB/16.84MB
 5e28347af205 Downloading [>                                                  ]  2.738kB/173.2kB
 0368fd46e3c6 Extracting [==================================================>]  3.638MB/3.638MB
 5e28347af205 Verifying Checksum 
 5e28347af205 Download complete 
 cb1ff4086f82 Extracting [=========>                                         ]  3.342MB/16.84MB
 6c13c55b4b82 Extracting [============>                                      ]  26.18MB/103.9MB
 0368fd46e3c6 Pull complete 
 311eca34042e Downloading [>                                                  ]  10.63kB/1.003MB
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Extracting [==================================================>]     950B/950B
 311eca34042e Verifying Checksum 
 311eca34042e Download complete 
 e6fe6f07e192 Downloading [>                                                  ]  127.9kB/12.41MB
 4c55286bbede Pull complete 
 5e28347af205 Extracting [=========>                                         ]  32.77kB/173.2kB
 6c13c55b4b82 Extracting [=============>                                     ]   27.3MB/103.9MB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 cb1ff4086f82 Extracting [==============>                                    ]  4.915MB/16.84MB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 e6fe6f07e192 Downloading [========================>                          ]  6.021MB/12.41MB
 cb1ff4086f82 Extracting [================>                                  ]  5.505MB/16.84MB
 e6fe6f07e192 Verifying Checksum 
 e6fe6f07e192 Download complete 
 6c13c55b4b82 Extracting [=============>                                     ]  27.85MB/103.9MB
 cb1ff4086f82 Extracting [==================>                                ]  6.291MB/16.84MB
 6c13c55b4b82 Extracting [=============>                                     ]  28.97MB/103.9MB
 5e28347af205 Pull complete 
 311eca34042e Extracting [=>                                                 ]  32.77kB/1.003MB
 a2cadbfeca72 Downloading [==================================================>]      99B/99B
 a2cadbfeca72 Verifying Checksum 
 a2cadbfeca72 Download complete 
 cb1ff4086f82 Extracting [=======================>                           ]  7.864MB/16.84MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 6c13c55b4b82 Extracting [==============>                                    ]  30.08MB/103.9MB
 311eca34042e Pull complete 
 e6fe6f07e192 Extracting [>                                                  ]  131.1kB/12.41MB
 4f4fb700ef54 Downloading [==================================================>]      32B/32B
 4f4fb700ef54 Verifying Checksum 
 4f4fb700ef54 Download complete 
 cb1ff4086f82 Extracting [============================>                      ]  9.634MB/16.84MB
 6c13c55b4b82 Extracting [===============>                                   ]   31.2MB/103.9MB
 e6fe6f07e192 Extracting [====>                                              ]  1.049MB/12.41MB
 6c13c55b4b82 Extracting [===============>                                   ]  32.31MB/103.9MB
 cb1ff4086f82 Extracting [=================================>                 ]  11.21MB/16.84MB
 e6fe6f07e192 Extracting [========>                                          ]  2.228MB/12.41MB
 a976ed7e7808 Downloading [==================================================>]     574B/574B
 a976ed7e7808 Verifying Checksum 
 a976ed7e7808 Download complete 
 cb1ff4086f82 Extracting [=====================================>             ]  12.78MB/16.84MB
 6c13c55b4b82 Extracting [================>                                  ]  33.42MB/103.9MB
 e6fe6f07e192 Extracting [=============>                                     ]  3.408MB/12.41MB
 cb1ff4086f82 Extracting [===========================================>       ]  14.75MB/16.84MB
 e6fe6f07e192 Extracting [==================>                                ]  4.588MB/12.41MB
 6c13c55b4b82 Extracting [================>                                  ]  35.09MB/103.9MB
 e6fe6f07e192 Extracting [======================>                            ]  5.636MB/12.41MB
 6c13c55b4b82 Extracting [=================>                                 ]  36.77MB/103.9MB
 cb1ff4086f82 Extracting [==================================================>]  16.84MB/16.84MB
 e6fe6f07e192 Extracting [===========================>                       ]  6.947MB/12.41MB
 6c13c55b4b82 Extracting [==================>                                ]  38.99MB/103.9MB
 cb1ff4086f82 Pull complete 
 e6fe6f07e192 Extracting [=================================>                 ]  8.389MB/12.41MB
 nginx Pulled 
 6c13c55b4b82 Extracting [===================>                               ]  41.22MB/103.9MB
 e6fe6f07e192 Extracting [========================================>          ]  10.09MB/12.41MB
 6c13c55b4b82 Extracting [=====================>                             ]  44.56MB/103.9MB
 e6fe6f07e192 Extracting [===============================================>   ]   11.8MB/12.41MB
 e6fe6f07e192 Extracting [==================================================>]  12.41MB/12.41MB
 e6fe6f07e192 Pull complete 
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 6c13c55b4b82 Extracting [======================>                            ]  47.35MB/103.9MB
 a2cadbfeca72 Pull complete 
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Pull complete 
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 a976ed7e7808 Pull complete 
 6c13c55b4b82 Extracting [=======================>                           ]  49.02MB/103.9MB
 redis Pulled 
 6c13c55b4b82 Extracting [========================>                          ]  50.69MB/103.9MB
 6c13c55b4b82 Extracting [=========================>                         ]  52.36MB/103.9MB
 6c13c55b4b82 Extracting [==========================>                        ]  54.59MB/103.9MB
 6c13c55b4b82 Extracting [===========================>                       ]  57.38MB/103.9MB
 6c13c55b4b82 Extracting [=============================>                     ]  60.72MB/103.9MB
 6c13c55b4b82 Extracting [==============================>                    ]  64.06MB/103.9MB
 6c13c55b4b82 Extracting [================================>                  ]   67.4MB/103.9MB
 6c13c55b4b82 Extracting [==================================>                ]   71.3MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.09MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.65MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]  75.76MB/103.9MB
 6c13c55b4b82 Extracting [=====================================>             ]  77.43MB/103.9MB
 6c13c55b4b82 Extracting [======================================>            ]  79.66MB/103.9MB
 6c13c55b4b82 Extracting [=======================================>           ]  81.89MB/103.9MB
 6c13c55b4b82 Extracting [========================================>          ]  84.67MB/103.9MB
 6c13c55b4b82 Extracting [=========================================>         ]   86.9MB/103.9MB
 6c13c55b4b82 Extracting [==========================================>        ]  89.13MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]   90.8MB/103.9MB
 6c13c55b4b82 Extracting [=============================================>     ]  93.59MB/103.9MB
 6c13c55b4b82 Extracting [==============================================>    ]  96.37MB/103.9MB
 6c13c55b4b82 Extracting [===============================================>   ]  99.71MB/103.9MB
 6c13c55b4b82 Extracting [=================================================> ]  102.5MB/103.9MB
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
#3 [backend internal] load build definition from Dockerfile.fixed
#3 transferring dockerfile: 1.87kB done
#3 WARN: FromAsCasing: 'as' and 'FROM' keywords' casing do not match (line 2)
#3 DONE 0.0s
#4 [frontend internal] load build definition from Dockerfile
#4 transferring dockerfile: 1.58kB done
#4 DONE 0.0s
#5 [frontend internal] load metadata for docker.io/library/node:22-alpine
#5 ...
#6 [backend internal] load metadata for docker.io/library/alpine:3.22
#6 DONE 0.7s
#7 [backend internal] load metadata for docker.io/library/rust:1.89.0-alpine
#7 DONE 0.8s
#8 [backend internal] load .dockerignore
#8 transferring context: 2B done
#8 DONE 0.0s
#9 [website internal] load metadata for docker.io/library/node:18-alpine
#9 DONE 0.8s
#10 [backend builder  1/11] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#10 DONE 0.0s
#11 [backend stage-1 1/7] FROM docker.io/library/alpine:3.22@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#11 DONE 0.0s
#12 [backend internal] load build context
#12 transferring context: 1.69kB done
#12 DONE 0.0s
#5 [frontend internal] load metadata for docker.io/library/node:22-alpine
#5 DONE 0.8s
#13 [website internal] load .dockerignore
#13 transferring context: 2B done
#13 DONE 0.0s
#14 [backend builder 11/11] RUN cargo build --release
#14 CACHED
#15 [backend builder  8/11] RUN rm src/main.rs
#15 CACHED
#16 [backend stage-1 3/7] WORKDIR /app
#16 CACHED
#17 [backend builder  3/11] RUN apk add --no-cache     pkgconfig     openssl-dev     postgresql-dev     musl-dev     gcc     curl
#17 CACHED
#18 [backend stage-1 4/7] COPY --from=builder /app/target/release/viworks-admin-backend /app/app
#18 CACHED
#19 [backend builder  7/11] RUN cargo build --release
#19 CACHED
#20 [backend builder  6/11] RUN mkdir src && echo "fn main() {}" > src/main.rs
#20 CACHED
#21 [backend builder  9/11] COPY src ./src
#21 CACHED
#22 [backend builder  2/11] WORKDIR /app
#22 CACHED
#23 [backend stage-1 2/7] RUN apk add --no-cache     ca-certificates     dumb-init     busybox-extras     netcat-openbsd     wget     curl     tzdata     bash     postgresql-client     redis
#23 CACHED
#24 [backend builder  4/11] RUN rustup target add x86_64-unknown-linux-musl
#24 CACHED
#25 [backend stage-1 6/7] COPY ops/entrypoint.sh /app/entrypoint.sh
#25 CACHED
#26 [backend stage-1 5/7] COPY --from=builder /app/migrations /app/migrations
#26 CACHED
#27 [backend builder 10/11] COPY migrations ./migrations
#27 CACHED
#28 [backend builder  5/11] COPY Cargo.toml Cargo.lock* ./
#28 CACHED
#29 [backend stage-1 7/7] RUN adduser -D -u 10001 appuser &&     chown -R appuser:appuser /app &&     chmod +x /app/entrypoint.sh
#29 CACHED
#30 [website base 1/1] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#30 DONE 0.0s
#31 [backend] exporting to image
#31 exporting layers done
#31 writing image sha256:676719744fa999f1783137f35f989f7eac894f1e93e88cdb3c7c35e7e27a0957 done
#31 naming to docker.io/library/digitaloceandocker-backend 0.0s done
#31 DONE 0.0s
#32 [frontend internal] load .dockerignore
#32 transferring context: 2B done
#32 DONE 0.1s
#33 [website internal] load build context
#33 transferring context: 7.37kB 0.1s done
#33 DONE 0.1s
#34 [backend] resolving provenance for metadata file
#34 DONE 0.0s
#35 [frontend builder 1/7] FROM docker.io/library/node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9
#35 DONE 0.0s
#36 [website runner 5/8] RUN mkdir .next
#36 CACHED
#37 [website builder 1/5] WORKDIR /app
#37 CACHED
#38 [website deps 2/4] WORKDIR /app
#38 CACHED
#39 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#39 CACHED
#40 [website builder 5/5] RUN npm run build
#40 CACHED
#41 [website runner 6/8] RUN chown nextjs:nodejs .next
#41 CACHED
#42 [website runner 4/8] COPY --from=builder /app/public ./public
#42 CACHED
#43 [website runner 2/8] RUN addgroup --system --gid 1001 nodejs
#43 CACHED
#44 [website runner 7/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#44 CACHED
#45 [website builder 4/5] RUN mkdir -p public
#45 CACHED
#46 [website deps 1/4] RUN apk add --no-cache libc6-compat
#46 CACHED
#47 [website builder 3/5] COPY . .
#47 CACHED
#48 [website builder 2/5] COPY --from=deps /app/node_modules ./node_modules
#48 CACHED
#49 [website runner 3/8] RUN adduser --system --uid 1001 nextjs
#49 CACHED
#50 [website deps 3/4] COPY package.json pnpm-lock.yaml* ./
#50 CACHED
#51 [website runner 8/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#51 CACHED
#52 [frontend internal] load build context
#52 transferring context: 5.92kB 0.0s done
#52 DONE 0.0s
#53 [frontend builder 3/7] RUN apk add --no-cache python3 make g++
#53 CACHED
#54 [frontend builder 4/7] COPY package*.json ./
#54 CACHED
#55 [frontend builder 2/7] WORKDIR /app
#55 CACHED
#56 [frontend builder 5/7] RUN npm install
#56 CACHED
#57 [website] exporting to image
#57 exporting layers done
#57 writing image sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a done
#57 naming to docker.io/library/digitaloceandocker-website done
#57 DONE 0.0s
#58 [frontend builder 6/7] COPY . .
#58 DONE 0.5s
#59 [website] resolving provenance for metadata file
#59 DONE 0.0s
#60 [frontend builder 7/7] RUN echo "Starting build process..." &&     npm run build &&     echo "Build completed. Checking standalone output..." &&     ls -la .next/ &&     ls -la .next/standalone/ || echo "Standalone directory not found!" &&     echo "Build verification complete."
#60 0.254 Starting build process...
#60 0.486 
#60 0.486 > frontend@0.1.0 build
#60 0.486 > next build
#60 0.486 
#60 2.125  ⚠ Invalid next.config.ts options detected: 
#60 2.126  ⚠     Unrecognized key(s) in object: 'generateStaticParams'
#60 2.126  ⚠ See more info here: https://nextjs.org/docs/messages/invalid-next-config
#60 2.143 Attention: Next.js now collects completely anonymous telemetry regarding usage.
#60 2.144 This information is used to shape Next.js' roadmap and prioritize features.
#60 2.144 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
#60 2.144 https://nextjs.org/telemetry
#60 2.144 
#60 2.257    ▲ Next.js 15.5.2
#60 2.259 
#60 2.472    Creating an optimized production build ...
#60 30.79  ✓ Compiled successfully in 28.1s
#60 30.80    Skipping validation of types
#60 30.80    Skipping linting
#60 31.34    Collecting page data ...
#60 34.63    Generating static pages (0/9) ...
#60 36.01    Generating static pages (2/9) 
#60 36.83    Generating static pages (4/9) 
#60 36.83    Generating static pages (6/9) 
#60 36.83  ✓ Generating static pages (9/9)
#60 38.24    Finalizing page optimization ...
#60 38.24    Collecting build traces ...
#60 80.33 
#60 80.35 Route (app)                                 Size  First Load JS
#60 80.35 ┌ ○ /                                    88.9 kB         209 kB
#60 80.35 ├ ○ /_not-found                            135 B         102 kB
#60 80.35 ├ ƒ /api/admin/login                       135 B         102 kB
#60 80.35 ├ ƒ /api/admin/logout                      135 B         102 kB
#60 80.35 ├ ƒ /api/admin/me                          135 B         102 kB
#60 80.35 └ ○ /login                               23.9 kB         134 kB
#60 80.35 + First Load JS shared by all             102 kB
#60 80.35   ├ chunks/255-310f1cc3c9beb704.js       45.7 kB
#60 80.35   ├ chunks/4bd1b696-c023c6e3521b1417.js  54.2 kB
#60 80.35   └ other shared chunks (total)          1.93 kB
#60 80.35 
#60 80.35 
#60 80.35 ƒ Middleware                             33.9 kB
#60 80.35 
#60 80.35 ○  (Static)   prerendered as static content
#60 80.35 ƒ  (Dynamic)  server-rendered on demand
#60 80.35 
#60 80.52 
#60 80.52 > frontend@0.1.0 postbuild
#60 80.52 > echo 'Build completed. Verifying standalone output...' && ls -la .next/ && ls -la .next/standalone/ || echo 'WARNING: Standalone directory not found!'
#60 80.52 
#60 80.52 Build completed. Verifying standalone output...
#60 80.52 total 660
#60 80.52 drwxr-xr-x    8 ***     ***          4096 Sep  2 18:50 .
#60 80.52 drwxr-xr-x    1 ***     ***          4096 Sep  2 18:49 ..
#60 80.52 -rw-r--r--    1 ***     ***            21 Sep  2 18:49 BUILD_ID
#60 80.52 -rw-r--r--    1 ***     ***          2688 Sep  2 18:49 app-build-manifest.json
#60 80.52 -rw-r--r--    1 ***     ***           262 Sep  2 18:49 app-path-routes-manifest.json
#60 80.52 -rw-r--r--    1 ***     ***           995 Sep  2 18:49 build-manifest.json
#60 80.52 drwxr-xr-x    4 ***     ***          4096 Sep  2 18:49 cache
#60 80.52 drwxr-xr-x    2 ***     ***          4096 Sep  2 18:49 diagnostics
#60 80.52 -rw-r--r--    1 ***     ***           111 Sep  2 18:49 export-marker.json
#60 80.52 -rw-r--r--    1 ***     ***           867 Sep  2 18:49 images-manifest.json
#60 80.52 -rw-r--r--    1 ***     ***          7826 Sep  2 18:50 next-minimal-server.js.nft.json
#60 80.52 -rw-r--r--    1 ***     ***        120508 Sep  2 18:50 next-server.js.nft.json
#60 80.52 -rw-r--r--    1 ***     ***            20 Sep  2 18:49 package.json
#60 80.52 -rw-r--r--    1 ***     ***          3038 Sep  2 18:49 prerender-manifest.json
#60 80.52 -rw-r--r--    1 ***     ***             2 Sep  2 18:49 react-loadable-manifest.json
#60 80.52 -rw-r--r--    1 ***     ***          9107 Sep  2 18:49 required-server-files.json
#60 80.52 -rw-r--r--    1 ***     ***          1599 Sep  2 18:49 routes-manifest.json
#60 80.52 drwxr-xr-x    6 ***     ***          4096 Sep  2 18:49 server
#60 80.52 drwxr-xr-x    4 ***     ***          4096 Sep  2 18:50 standalone
#60 80.52 drwxr-xr-x    5 ***     ***          4096 Sep  2 18:49 static
#60 80.52 -rw-r--r--    1 ***     ***        455711 Sep  2 18:50 trace
#60 80.52 drwxr-xr-x    3 ***     ***          4096 Sep  2 18:49 types
#60 80.53 total 28
#60 80.53 drwxr-xr-x    4 ***     ***          4096 Sep  2 18:50 .
#60 80.53 drwxr-xr-x    8 ***     ***          4096 Sep  2 18:50 ..
#60 80.53 drwxr-xr-x    3 ***     ***          4096 Sep  2 18:50 .next
#60 80.53 drwxr-xr-x   23 ***     ***          4096 Sep  2 18:50 node_modules
#60 80.53 -rw-r--r--    1 ***     ***          1504 Sep  2 18:50 package.json
#60 80.53 -rw-r--r--    1 ***     ***          6529 Sep  2 18:50 server.js
#60 80.54 Build completed. Checking standalone output...
#60 80.55 total 660
#60 80.55 drwxr-xr-x    8 ***     ***          4096 Sep  2 18:50 .
#60 80.55 drwxr-xr-x    1 ***     ***          4096 Sep  2 18:49 ..
#60 80.55 -rw-r--r--    1 ***     ***            21 Sep  2 18:49 BUILD_ID
#60 80.55 -rw-r--r--    1 ***     ***          2688 Sep  2 18:49 app-build-manifest.json
#60 80.55 -rw-r--r--    1 ***     ***           262 Sep  2 18:49 app-path-routes-manifest.json
#60 80.55 -rw-r--r--    1 ***     ***           995 Sep  2 18:49 build-manifest.json
#60 80.55 drwxr-xr-x    4 ***     ***          4096 Sep  2 18:49 cache
#60 80.55 drwxr-xr-x    2 ***     ***          4096 Sep  2 18:49 diagnostics
#60 80.55 -rw-r--r--    1 ***     ***           111 Sep  2 18:49 export-marker.json
#60 80.55 -rw-r--r--    1 ***     ***           867 Sep  2 18:49 images-manifest.json
#60 80.55 -rw-r--r--    1 ***     ***          7826 Sep  2 18:50 next-minimal-server.js.nft.json
#60 80.55 -rw-r--r--    1 ***     ***        120508 Sep  2 18:50 next-server.js.nft.json
#60 80.55 -rw-r--r--    1 ***     ***            20 Sep  2 18:49 package.json
#60 80.55 -rw-r--r--    1 ***     ***          3038 Sep  2 18:49 prerender-manifest.json
#60 80.55 -rw-r--r--    1 ***     ***             2 Sep  2 18:49 react-loadable-manifest.json
#60 80.55 -rw-r--r--    1 ***     ***          9107 Sep  2 18:49 required-server-files.json
#60 80.55 -rw-r--r--    1 ***     ***          1599 Sep  2 18:49 routes-manifest.json
#60 80.55 drwxr-xr-x    6 ***     ***          4096 Sep  2 18:49 server
#60 80.55 drwxr-xr-x    4 ***     ***          4096 Sep  2 18:50 standalone
#60 80.55 drwxr-xr-x    5 ***     ***          4096 Sep  2 18:49 static
#60 80.55 -rw-r--r--    1 ***     ***        455711 Sep  2 18:50 trace
#60 80.55 drwxr-xr-x    3 ***     ***          4096 Sep  2 18:49 types
#60 80.55 total 28
#60 80.55 drwxr-xr-x    4 ***     ***          4096 Sep  2 18:50 .
#60 80.55 drwxr-xr-x    8 ***     ***          4096 Sep  2 18:50 ..
#60 80.55 drwxr-xr-x    3 ***     ***          4096 Sep  2 18:50 .next
#60 80.55 drwxr-xr-x   23 ***     ***          4096 Sep  2 18:50 node_modules
#60 80.55 -rw-r--r--    1 ***     ***          1504 Sep  2 18:50 package.json
#60 80.55 -rw-r--r--    1 ***     ***          6529 Sep  2 18:50 server.js
#60 80.55 Build verification complete.
#60 DONE 80.7s
#61 [frontend runner 2/7] RUN apk add --no-cache dumb-init
#61 CACHED
#62 [frontend runner 3/7] RUN addgroup -g 1001 -S nodejs &&     adduser -u 1001 -S nextjs -G nodejs
#62 CACHED
#63 [frontend runner 4/7] WORKDIR /app
#63 CACHED
#64 [frontend runner 5/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#64 DONE 0.6s
#65 [frontend runner 6/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#65 DONE 0.1s
#66 [frontend runner 7/7] RUN mkdir -p ./public
#66 DONE 0.3s
#67 [frontend] exporting to image
#67 exporting layers
#67 exporting layers 1.0s done
#67 writing image sha256:df2cf8a866a5befb875fe291eb18a8b6f2259ac2f55c7339cfbb6998df3cccda done
#67 naming to docker.io/library/digitaloceandocker-frontend done
#67 DONE 1.0s
#68 [frontend] resolving provenance for metadata file
#68 DONE 0.0s
 digitaloceandocker-backend  Built
 digitaloceandocker-frontend  Built
 digitaloceandocker-website  Built
 Container viworks-postgres  Creating
 Container viworks-redis  Creating
 Container viworks-website  Creating
 Container viworks-website  Created
 Container viworks-postgres  Created
 Container viworks-redis  Created
 Container viworks-backend  Creating
 Container viworks-backend  Created
 Container viworks-frontend  Creating
 Container viworks-frontend  Created
 Container viworks-nginx  Creating
 Container viworks-nginx  Created
 Container viworks-website  Starting
 Container viworks-postgres  Starting
 Container viworks-redis  Starting
 Container viworks-postgres  Started
 Container viworks-website  Started
 Container viworks-redis  Started
 Container viworks-redis  Waiting
 Container viworks-postgres  Waiting
 Container viworks-postgres  Healthy
 Container viworks-redis  Healthy
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
Temporarily overriding HOME='/home/runner/work/_temp/6313c9b1-f172-44f7-afe6-fe493d5b6b6a' before making global git config changes
Adding repository directory to the temporary git global config as a safe directory
/usr/bin/git config --global --add safe.directory /home/runner/work/viworkdemo002/viworkdemo002
/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
http.https://github.com/.extraheader
/usr/bin/git config --local --unset-all http.https://github.com/.extraheader
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
