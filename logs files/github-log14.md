deploy
failed now in 10m 44s

1s
1s
1s
3s
0s
10m 35s
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
Total reclaimed space: 351MB
🧹 Cleaning up unused networks...
Deleted Networks:
viworks-public
viworks-internal
🔍 Verifying no conflicting containers exist...
🧹 Cleaning up and resetting git repository...
From https://github.com/apebrahimi/viworkdemo002
   31e2352..0236214  main       -> origin/main
HEAD is now at 0236214 fix: Resolve backend startup issues for admin authentication deployment
🌐 Setting up two-network security architecture...
e1ae8f13f0c62568d6bbc72ce16359dbc7fda5ffb38a82005eb8fab1f235d10c
e6f651e08f99bed24a252953d04ed409954014a40785d527f2b91313825feaa1
🔨 Building and starting new containers with two-network security...
 redis Pulling 
 nginx Pulling 
 postgres Pulling 
 9824c27679d3 Already exists 
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
 a976ed7e7808 Waiting 
 4f4fb700ef54 Waiting 
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
 a612d38c9b48 Waiting 
 901a9540064a Waiting 
 6c13c55b4b82 Waiting 
 0f940631c13f Waiting 
 a15854d6fd91 Waiting 
 685be96195b7 Waiting 
 ce414b3fa674 Waiting 
 6afcd9ec0fd9 Waiting 
 61a7421693bd Waiting 
 51a939567803 Waiting 
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
 0368fd46e3c6 Downloading [>                                                  ]  36.88kB/3.638MB
 4c55286bbede Downloading [==================================================>]     950B/950B
 4c55286bbede Verifying Checksum 
 4c55286bbede Download complete 
 0368fd46e3c6 Downloading [==========================>                        ]  1.933MB/3.638MB
 0368fd46e3c6 Downloading [==================================================>]  3.638MB/3.638MB
 0368fd46e3c6 Verifying Checksum 
 0368fd46e3c6 Download complete 
 0368fd46e3c6 Extracting [>                                                  ]  65.54kB/3.638MB
 5e28347af205 Downloading [>                                                  ]  2.738kB/173.2kB
 0368fd46e3c6 Extracting [==================>                                ]  1.376MB/3.638MB
 5e28347af205 Downloading [=======================================>           ]  135.3kB/173.2kB
 5e28347af205 Download complete 
 0368fd46e3c6 Extracting [========================================>          ]  2.949MB/3.638MB
 0368fd46e3c6 Extracting [==================================================>]  3.638MB/3.638MB
 311eca34042e Downloading [>                                                  ]  10.95kB/1.003MB
 311eca34042e Verifying Checksum 
 311eca34042e Download complete 
 0368fd46e3c6 Pull complete 
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Pull complete 
 5e28347af205 Extracting [=========>                                         ]  32.77kB/173.2kB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 e6fe6f07e192 Downloading [>                                                  ]  127.9kB/12.41MB
 5e28347af205 Pull complete 
 311eca34042e Extracting [=>                                                 ]  32.77kB/1.003MB
 a2cadbfeca72 Downloading [==================================================>]      99B/99B
 a2cadbfeca72 Verifying Checksum 
 a2cadbfeca72 Download complete 
 e6fe6f07e192 Downloading [==>                                                ]  651.3kB/12.41MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 311eca34042e Pull complete 
 e6fe6f07e192 Downloading [====>                                              ]   1.18MB/12.41MB
 4f4fb700ef54 Downloading [==================================================>]      32B/32B
 4f4fb700ef54 Verifying Checksum 
 4f4fb700ef54 Download complete 
 e6fe6f07e192 Downloading [======>                                            ]  1.704MB/12.41MB
 e6fe6f07e192 Downloading [=========>                                         ]  2.359MB/12.41MB
 e6fe6f07e192 Downloading [=================>                                 ]  4.456MB/12.41MB
 a976ed7e7808 Downloading [==================================================>]     574B/574B
 a976ed7e7808 Verifying Checksum 
 a976ed7e7808 Download complete 
 e6fe6f07e192 Downloading [========================================>          ]  10.09MB/12.41MB
 e6fe6f07e192 Verifying Checksum 
 e6fe6f07e192 Download complete 
 e6fe6f07e192 Extracting [>                                                  ]  131.1kB/12.41MB
 61a7421693bd Downloading [==================================================>]     969B/969B
 61a7421693bd Verifying Checksum 
 61a7421693bd Download complete 
 61a7421693bd Extracting [==================================================>]     969B/969B
 61a7421693bd Extracting [==================================================>]     969B/969B
 e6fe6f07e192 Extracting [=======>                                           ]  1.835MB/12.41MB
 61a7421693bd Pull complete 
 e6fe6f07e192 Extracting [============>                                      ]  3.146MB/12.41MB
 51a939567803 Downloading [>                                                  ]  12.32kB/1.116MB
 e6fe6f07e192 Extracting [===========================>                       ]  6.816MB/12.41MB
 51a939567803 Download complete 
 51a939567803 Extracting [=>                                                 ]  32.77kB/1.116MB
 e6fe6f07e192 Extracting [======================================>            ]  9.437MB/12.41MB
 51a939567803 Extracting [=================================>                 ]  753.7kB/1.116MB
 51a939567803 Extracting [==================================================>]  1.116MB/1.116MB
 a612d38c9b48 Downloading [==================================================>]     175B/175B
 a612d38c9b48 Verifying Checksum 
 a612d38c9b48 Download complete 
 51a939567803 Pull complete 
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 e6fe6f07e192 Extracting [===============================================>   ]  11.67MB/12.41MB
 901a9540064a Downloading [==================================================>]     116B/116B
 901a9540064a Verifying Checksum 
 901a9540064a Download complete 
 a612d38c9b48 Pull complete 
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Extracting [==================================================>]     116B/116B
 e6fe6f07e192 Extracting [==================================================>]  12.41MB/12.41MB
 901a9540064a Pull complete 
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
 6c13c55b4b82 Downloading [>                                                  ]  540.7kB/103.9MB
 6c13c55b4b82 Downloading [===>                                               ]  7.471MB/103.9MB
 6c13c55b4b82 Downloading [======>                                            ]  14.43MB/103.9MB
 0f940631c13f Downloading [=====>                                             ]  1.049kB/9.448kB
 0f940631c13f Downloading [==================================================>]  9.448kB/9.448kB
 0f940631c13f Verifying Checksum 
 0f940631c13f Download complete 
 a15854d6fd91 Downloading [==================================================>]     129B/129B
 a15854d6fd91 Verifying Checksum 
 a15854d6fd91 Download complete 
 6c13c55b4b82 Downloading [==========>                                        ]  22.45MB/103.9MB
 6c13c55b4b82 Downloading [=============>                                     ]  28.86MB/103.9MB
 6c13c55b4b82 Downloading [=================>                                 ]  36.34MB/103.9MB
 6c13c55b4b82 Downloading [====================>                              ]  42.21MB/103.9MB
 685be96195b7 Downloading [==================================================>]     171B/171B
 685be96195b7 Verifying Checksum 
 685be96195b7 Download complete 
 6c13c55b4b82 Downloading [=======================>                           ]  49.14MB/103.9MB
 ce414b3fa674 Downloading [========>                                          ]  1.049kB/5.927kB
 ce414b3fa674 Downloading [==================================================>]  5.927kB/5.927kB
 ce414b3fa674 Verifying Checksum 
 ce414b3fa674 Download complete 
 6c13c55b4b82 Downloading [===========================>                       ]   56.6MB/103.9MB
 6c13c55b4b82 Downloading [=============================>                     ]  60.87MB/103.9MB
 6c13c55b4b82 Downloading [================================>                  ]  67.27MB/103.9MB
 6c13c55b4b82 Downloading [====================================>              ]  76.34MB/103.9MB
 6afcd9ec0fd9 Downloading [==================================================>]     185B/185B
 6afcd9ec0fd9 Verifying Checksum 
 6afcd9ec0fd9 Download complete 
 6c13c55b4b82 Downloading [========================================>          ]  83.27MB/103.9MB
 6bc572a340ec Downloading [>                                                  ]  19.17kB/1.806MB
 6bc572a340ec Verifying Checksum 
 6bc572a340ec Download complete 
 6bc572a340ec Extracting [>                                                  ]  32.77kB/1.806MB
 6c13c55b4b82 Downloading [==========================================>        ]  89.12MB/103.9MB
 6bc572a340ec Extracting [==============>                                    ]  524.3kB/1.806MB
 6c13c55b4b82 Downloading [=============================================>     ]  94.99MB/103.9MB
 6c13c55b4b82 Downloading [=================================================> ]    103MB/103.9MB
 6c13c55b4b82 Verifying Checksum 
 6c13c55b4b82 Download complete 
 403e3f251637 Downloading [==================================================>]     628B/628B
 403e3f251637 Verifying Checksum 
 403e3f251637 Download complete 
 6bc572a340ec Extracting [==================================================>]  1.806MB/1.806MB
 6c13c55b4b82 Extracting [>                                                  ]  557.1kB/103.9MB
 9adfbae99cb7 Downloading [==================================================>]     955B/955B
 9adfbae99cb7 Verifying Checksum 
 9adfbae99cb7 Download complete 
 6c13c55b4b82 Extracting [>                                                  ]  1.114MB/103.9MB
 6bc572a340ec Pull complete 
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Extracting [==================================================>]     628B/628B
 7a8a46741e18 Downloading [==================================================>]     405B/405B
 7a8a46741e18 Verifying Checksum 
 7a8a46741e18 Download complete 
 403e3f251637 Pull complete 
 6c13c55b4b82 Extracting [=>                                                 ]  2.228MB/103.9MB
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 c9ebe2ff2d2c Downloading [===========================================>       ]  1.049kB/1.209kB
 c9ebe2ff2d2c Downloading [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Verifying Checksum 
 c9ebe2ff2d2c Download complete 
 9adfbae99cb7 Pull complete 
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 7a8a46741e18 Extracting [==================================================>]     405B/405B
 a992fbc61ecc Downloading [=====================================>             ]  1.049kB/1.398kB
 a992fbc61ecc Downloading [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Verifying Checksum 
 a992fbc61ecc Download complete 
 7a8a46741e18 Pull complete 
 6c13c55b4b82 Extracting [=>                                                 ]  3.899MB/103.9MB
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Extracting [==================================================>]  1.209kB/1.209kB
 c9ebe2ff2d2c Pull complete 
 6c13c55b4b82 Extracting [==>                                                ]  5.014MB/103.9MB
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Extracting [==================================================>]  1.398kB/1.398kB
 a992fbc61ecc Pull complete 
 cb1ff4086f82 Downloading [>                                                  ]  171.9kB/16.84MB
 6c13c55b4b82 Extracting [==>                                                ]  6.128MB/103.9MB
 cb1ff4086f82 Downloading [===============>                                   ]  5.378MB/16.84MB
 cb1ff4086f82 Downloading [============================>                      ]  9.646MB/16.84MB
 6c13c55b4b82 Extracting [===>                                               ]  7.242MB/103.9MB
 cb1ff4086f82 Downloading [==========================================>        ]  14.47MB/16.84MB
 6c13c55b4b82 Extracting [====>                                              ]  8.356MB/103.9MB
 cb1ff4086f82 Verifying Checksum 
 cb1ff4086f82 Download complete 
 cb1ff4086f82 Extracting [>                                                  ]  196.6kB/16.84MB
 6c13c55b4b82 Extracting [====>                                              ]   9.47MB/103.9MB
 6c13c55b4b82 Extracting [=====>                                             ]  10.58MB/103.9MB
 cb1ff4086f82 Extracting [=>                                                 ]  393.2kB/16.84MB
 cb1ff4086f82 Extracting [===>                                               ]   1.18MB/16.84MB
 6c13c55b4b82 Extracting [=====>                                             ]  12.26MB/103.9MB
 6c13c55b4b82 Extracting [======>                                            ]  13.37MB/103.9MB
 cb1ff4086f82 Extracting [=====>                                             ]  1.966MB/16.84MB
 cb1ff4086f82 Extracting [========>                                          ]  2.753MB/16.84MB
 6c13c55b4b82 Extracting [=======>                                           ]  15.04MB/103.9MB
 cb1ff4086f82 Extracting [=========>                                         ]  3.342MB/16.84MB
 cb1ff4086f82 Extracting [============>                                      ]  4.129MB/16.84MB
 6c13c55b4b82 Extracting [=======>                                           ]  16.15MB/103.9MB
 cb1ff4086f82 Extracting [==============>                                    ]  4.915MB/16.84MB
 6c13c55b4b82 Extracting [========>                                          ]  17.27MB/103.9MB
 cb1ff4086f82 Extracting [================>                                  ]  5.702MB/16.84MB
 6c13c55b4b82 Extracting [========>                                          ]  18.38MB/103.9MB
 cb1ff4086f82 Extracting [===================>                               ]  6.488MB/16.84MB
 6c13c55b4b82 Extracting [=========>                                         ]   19.5MB/103.9MB
 cb1ff4086f82 Extracting [=====================>                             ]  7.274MB/16.84MB
 6c13c55b4b82 Extracting [=========>                                         ]  20.61MB/103.9MB
 cb1ff4086f82 Extracting [=======================>                           ]  8.061MB/16.84MB
 cb1ff4086f82 Extracting [==========================>                        ]  8.847MB/16.84MB
 6c13c55b4b82 Extracting [==========>                                        ]  21.73MB/103.9MB
 cb1ff4086f82 Extracting [==============================>                    ]  10.22MB/16.84MB
 6c13c55b4b82 Extracting [==========>                                        ]  22.84MB/103.9MB
 cb1ff4086f82 Extracting [===================================>               ]   11.8MB/16.84MB
 6c13c55b4b82 Extracting [===========>                                       ]  23.95MB/103.9MB
 cb1ff4086f82 Extracting [========================================>          ]  13.76MB/16.84MB
 6c13c55b4b82 Extracting [============>                                      ]  25.07MB/103.9MB
 cb1ff4086f82 Extracting [==============================================>    ]  15.53MB/16.84MB
 6c13c55b4b82 Extracting [============>                                      ]  26.18MB/103.9MB
 6c13c55b4b82 Extracting [=============>                                     ]   27.3MB/103.9MB
 6c13c55b4b82 Extracting [=============>                                     ]  28.41MB/103.9MB
 cb1ff4086f82 Extracting [==================================================>]  16.84MB/16.84MB
 6c13c55b4b82 Extracting [==============>                                    ]  29.52MB/103.9MB
 6c13c55b4b82 Extracting [===============>                                   ]  31.75MB/103.9MB
 cb1ff4086f82 Pull complete 
 nginx Pulled 
 6c13c55b4b82 Extracting [===============>                                   ]  32.87MB/103.9MB
 6c13c55b4b82 Extracting [================>                                  ]  35.09MB/103.9MB
 6c13c55b4b82 Extracting [=================>                                 ]  37.32MB/103.9MB
 6c13c55b4b82 Extracting [===================>                               ]  39.55MB/103.9MB
 6c13c55b4b82 Extracting [====================>                              ]  42.34MB/103.9MB
 6c13c55b4b82 Extracting [=====================>                             ]  45.12MB/103.9MB
 6c13c55b4b82 Extracting [=======================>                           ]  47.91MB/103.9MB
 6c13c55b4b82 Extracting [=======================>                           ]  49.58MB/103.9MB
 6c13c55b4b82 Extracting [========================>                          ]  50.69MB/103.9MB
 6c13c55b4b82 Extracting [========================>                          ]  51.81MB/103.9MB
 6c13c55b4b82 Extracting [=========================>                         ]  52.92MB/103.9MB
 6c13c55b4b82 Extracting [==========================>                        ]  54.59MB/103.9MB
 6c13c55b4b82 Extracting [==========================>                        ]  55.71MB/103.9MB
 6c13c55b4b82 Extracting [===========================>                       ]  57.38MB/103.9MB
 6c13c55b4b82 Extracting [============================>                      ]   59.6MB/103.9MB
 6c13c55b4b82 Extracting [=============================>                     ]  61.83MB/103.9MB
 6c13c55b4b82 Extracting [===============================>                   ]  64.62MB/103.9MB
 6c13c55b4b82 Extracting [================================>                  ]   67.4MB/103.9MB
 6c13c55b4b82 Extracting [=================================>                 ]  70.19MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  73.53MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.65MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]   75.2MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]  75.76MB/103.9MB
 6c13c55b4b82 Extracting [=====================================>             ]  77.43MB/103.9MB
 6c13c55b4b82 Extracting [======================================>            ]   79.1MB/103.9MB
 6c13c55b4b82 Extracting [======================================>            ]  80.22MB/103.9MB
 6c13c55b4b82 Extracting [=======================================>           ]  81.89MB/103.9MB
 6c13c55b4b82 Extracting [========================================>          ]  83.56MB/103.9MB
 6c13c55b4b82 Extracting [========================================>          ]  84.67MB/103.9MB
 6c13c55b4b82 Extracting [=========================================>         ]   86.9MB/103.9MB
 6c13c55b4b82 Extracting [==========================================>        ]  89.13MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]   90.8MB/103.9MB
 6c13c55b4b82 Extracting [=============================================>     ]  93.59MB/103.9MB
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
#2 [website internal] load build definition from Dockerfile
#2 transferring dockerfile: 2.04kB 0.0s done
#2 DONE 0.1s
#3 [backend internal] load build definition from Dockerfile.fixed
#3 transferring dockerfile: 1.87kB 0.0s done
#3 WARN: FromAsCasing: 'as' and 'FROM' keywords' casing do not match (line 2)
#3 DONE 0.1s
#4 [frontend internal] load build definition from Dockerfile
#4 transferring dockerfile: 1.58kB 0.0s done
#4 DONE 0.1s
#5 [backend internal] load metadata for docker.io/library/rust:1.89.0-alpine
#5 ...
#6 [backend internal] load metadata for docker.io/library/alpine:3.22
#6 DONE 0.8s
#5 [backend internal] load metadata for docker.io/library/rust:1.89.0-alpine
#5 DONE 0.8s
#7 [backend internal] load .dockerignore
#7 transferring context: 2B done
#7 DONE 0.0s
#8 [frontend internal] load metadata for docker.io/library/node:22-alpine
#8 DONE 0.8s
#9 [backend builder  1/11] FROM docker.io/library/rust:1.89.0-alpine@sha256:4b800f2e72e04be908e5f634c504c741bd943b763d1d8ad7b096cc340e1b5b46
#9 DONE 0.0s
#10 [backend stage-1 1/7] FROM docker.io/library/alpine:3.22@sha256:4bcff63911fcb4448bd4fdacec207030997caf25e9bea4045fa6c8c44de311d1
#10 DONE 0.0s
#11 [frontend internal] load .dockerignore
#11 transferring context: 2B done
#11 DONE 0.0s
#12 [backend internal] load build context
#12 transferring context: 100.38kB 0.0s done
#12 DONE 0.0s
#13 [frontend builder 1/7] FROM docker.io/library/node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9
#13 DONE 0.0s
#14 [backend builder  3/11] RUN apk add --no-cache     pkgconfig     openssl-dev     postgresql-dev     musl-dev     gcc     curl
#14 CACHED
#15 [backend builder  2/11] WORKDIR /app
#15 CACHED
#16 [backend builder  4/11] RUN rustup target add x86_64-unknown-linux-musl
#16 CACHED
#17 [frontend internal] load build context
#17 transferring context: 5.93kB 0.0s done
#17 DONE 0.0s
#18 [website internal] load metadata for docker.io/library/node:18-alpine
#18 DONE 0.9s
#19 [frontend runner 6/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#19 CACHED
#20 [frontend builder 5/7] RUN npm install
#20 CACHED
#21 [frontend builder 3/7] RUN apk add --no-cache python3 make g++
#21 CACHED
#22 [frontend builder 7/7] RUN echo "Starting build process..." &&     npm run build &&     echo "Build completed. Checking standalone output..." &&     ls -la .next/ &&     ls -la .next/standalone/ || echo "Standalone directory not found!" &&     echo "Build verification complete."
#22 CACHED
#23 [frontend runner 3/7] RUN addgroup -g 1001 -S nodejs &&     adduser -u 1001 -S nextjs -G nodejs
#23 CACHED
#24 [frontend runner 5/7] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#24 CACHED
#25 [frontend builder 4/7] COPY package*.json ./
#25 CACHED
#26 [frontend builder 2/7] WORKDIR /app
#26 CACHED
#27 [frontend runner 2/7] RUN apk add --no-cache dumb-init
#27 CACHED
#28 [frontend builder 6/7] COPY . .
#28 CACHED
#29 [frontend runner 4/7] WORKDIR /app
#29 CACHED
#30 [frontend runner 7/7] RUN mkdir -p ./public
#30 CACHED
#31 [frontend] exporting to image
#31 exporting layers done
#31 writing image sha256:3433d6a717ac0bea5e019788e7735427aff300d81c07519034068b8f63927f7d 0.0s done
#31 naming to docker.io/library/digitaloceandocker-frontend
#31 ...
#32 [website internal] load .dockerignore
#32 transferring context: 2B done
#32 DONE 0.1s
#33 [backend builder  5/11] COPY Cargo.toml Cargo.lock* ./
#33 ...
#34 [website base 1/1] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#34 DONE 0.0s
#31 [frontend] exporting to image
#31 naming to docker.io/library/digitaloceandocker-frontend 0.2s done
#31 DONE 0.3s
#35 [website internal] load build context
#35 transferring context: 7.37kB 0.0s done
#35 DONE 0.1s
#33 [backend builder  5/11] COPY Cargo.toml Cargo.lock* ./
#33 ...
#36 [website builder 1/5] WORKDIR /app
#36 CACHED
#37 [website builder 3/5] COPY . .
#37 CACHED
#38 [website runner 5/8] RUN mkdir .next
#38 CACHED
#39 [website runner 2/8] RUN addgroup --system --gid 1001 nodejs
#39 CACHED
#40 [website builder 2/5] COPY --from=deps /app/node_modules ./node_modules
#40 CACHED
#41 [website runner 4/8] COPY --from=builder /app/public ./public
#41 CACHED
#42 [website deps 4/4] RUN npm install -g pnpm && pnpm install --frozen-lockfile
#42 CACHED
#43 [website runner 6/8] RUN chown nextjs:nodejs .next
#43 CACHED
#44 [website deps 2/4] WORKDIR /app
#44 CACHED
#45 [website builder 5/5] RUN npm run build
#45 CACHED
#46 [website runner 7/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#46 CACHED
#47 [website builder 4/5] RUN mkdir -p public
#47 CACHED
#48 [website deps 1/4] RUN apk add --no-cache libc6-compat
#48 CACHED
#49 [website deps 3/4] COPY package.json pnpm-lock.yaml* ./
#49 CACHED
#50 [website runner 3/8] RUN adduser --system --uid 1001 nextjs
#50 CACHED
#51 [website runner 8/8] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#51 CACHED
#33 [backend builder  5/11] COPY Cargo.toml Cargo.lock* ./
#33 DONE 0.6s
#52 [website] exporting to image
#52 exporting layers done
#52 writing image sha256:ad0e4ad0b2a44304e85428960f14873ae4a389b2108b463a43e4ecd221b7782a 0.0s done
#52 naming to docker.io/library/digitaloceandocker-website 0.0s done
#52 DONE 0.1s
#53 [frontend] resolving provenance for metadata file
#53 DONE 0.0s
#54 [website] resolving provenance for metadata file
#54 DONE 0.0s
#55 [backend builder  6/11] RUN mkdir src && echo "fn main() {}" > src/main.rs
#55 DONE 0.4s
#56 [backend builder  7/11] RUN cargo build --release
#56 0.703     Updating crates.io index
#56 2.584  Downloading crates ...
#56 2.710   Downloaded foreign-types v0.3.2
#56 2.740   Downloaded http-body v0.4.6
#56 2.763   Downloaded slab v0.4.11
#56 2.778   Downloaded thiserror v2.0.16
#56 2.807   Downloaded num-conv v0.1.0
#56 2.822   Downloaded num-integer v0.1.46
#56 2.841   Downloaded scopeguard v1.2.0
#56 2.850   Downloaded spin v0.9.8
#56 2.860   Downloaded signature v2.2.0
#56 2.866   Downloaded rsa v0.9.8
#56 2.882   Downloaded redis v0.24.0
#56 2.901   Downloaded rustls-webpki v0.103.4
#56 2.911   Downloaded reqwest v0.11.27
#56 2.929   Downloaded regex-lite v0.1.7
#56 2.943   Downloaded serde_json v1.0.143
#56 2.967   Downloaded regex-syntax v0.8.6
#56 2.987   Downloaded vcpkg v0.2.15
#56 3.083   Downloaded webpki-***s v1.0.2
#56 3.095   Downloaded tracing-subscriber v0.3.20
#56 3.113   Downloaded zerocopy v0.8.26
#56 3.156   Downloaded regex-automata v0.4.10
#56 3.188   Downloaded ring v0.17.14
#56 3.271   Downloaded actix-server v2.6.0
#56 3.278   Downloaded actix-service v2.0.3
#56 3.283   Downloaded actix-macros v0.2.4
#56 3.288   Downloaded actix-web v4.11.0
#56 3.313   Downloaded actix-codec v0.5.2
#56 3.316   Downloaded hyper v0.14.32
#56 3.333   Downloaded openssl-probe v0.1.6
#56 3.336   Downloaded pin-project v1.1.10
#56 3.362   Downloaded pin-project-internal v1.1.10
#56 3.367   Downloaded rustls-pki-types v1.12.0
#56 3.378   Downloaded regex v1.11.2
#56 3.394   Downloaded socket2 v0.5.10
#56 3.400   Downloaded libm v0.2.15
#56 3.419   Downloaded idna v1.1.0
#56 3.430   Downloaded icu_properties_data v2.0.1
#56 3.468   Downloaded zerovec v0.11.4
#56 3.482   Downloaded rustls v0.23.31
#56 3.515   Downloaded num-bigint v0.4.6
#56 3.528   Downloaded unicode-normalization v0.1.24
#56 3.544   Downloaded tokio-util v0.7.16
#56 3.567   Downloaded num-bigint-dig v0.8.4
#56 3.581   Downloaded jiff v0.2.15
#56 3.627   Downloaded time v0.3.41
#56 3.651   Downloaded tokio v1.47.1
#56 3.745   Downloaded rand v0.9.2
#56 3.756   Downloaded libc v0.2.175
#56 3.816   Downloaded zstd-sys v2.0.15+zstd.1.5.7
#56 3.862   Downloaded rand v0.8.5
#56 3.871   Downloaded openssl-sys v0.9.109
#56 3.885   Downloaded openssl v0.10.73
#56 3.909   Downloaded mio v1.0.4
#56 3.924   Downloaded memchr v2.7.5
#56 3.939   Downloaded indexmap v2.11.0
#56 3.951   Downloaded zerotrie v0.2.2
#56 3.959   Downloaded shlex v1.3.0
#56 3.964   Downloaded sharded-slab v0.1.7
#56 3.974   Downloaded sha2 v0.10.9
#56 3.979   Downloaded sha1_smol v1.0.1
#56 3.982   Downloaded serde_urlencoded v0.7.1
#56 3.986   Downloaded serde v1.0.219
#56 3.992   Downloaded proc-macro2 v1.0.101
#56 3.998   Downloaded icu_normalizer_data v2.0.0
#56 4.003   Downloaded icu_locale_core v2.0.0
#56 4.018   Downloaded icu_collections v2.0.0
#56 4.030   Downloaded url v2.5.7
#56 4.036   Downloaded tracing v0.1.41
#56 4.045   Downloaded tinyvec v1.10.0
#56 4.051   Downloaded socket2 v0.6.0
#56 4.056   Downloaded socket2 v0.4.10
#56 4.060   Downloaded simple_asn1 v0.6.3
#56 4.063   Downloaded signal-hook-registry v1.4.6
#56 4.066   Downloaded sha1 v0.10.6
#56 4.070   Downloaded serde_derive v1.0.219
#56 4.077   Downloaded ryu v1.0.20
#56 4.083   Downloaded rustls-pemfile v1.0.4
#56 4.088   Downloaded rand_core v0.9.3
#56 4.092   Downloaded potential_utf v0.1.3
#56 4.095   Downloaded miniz_oxide v0.8.9
#56 4.101   Downloaded language-tags v0.3.2
#56 4.105   Downloaded icu_properties v2.0.1
#56 4.113   Downloaded icu_normalizer v2.0.0
#56 4.120   Downloaded uuid v1.18.0
#56 4.126   Downloaded unicode-properties v0.1.3
#56 4.131   Downloaded unicode-ident v1.0.18
#56 4.136   Downloaded unicode-bidi v0.3.18
#56 4.142   Downloaded tracing-core v0.1.34
#56 4.148   Downloaded rand_core v0.6.4
#56 4.152   Downloaded rand_chacha v0.9.0
#56 4.155   Downloaded rand_chacha v0.3.1
#56 4.158   Downloaded quote v1.0.40
#56 4.164   Downloaded ppv-lite86 v0.2.21
#56 4.167   Downloaded powerfmt v0.2.0
#56 4.170   Downloaded pkg-config v0.3.32
#56 4.175   Downloaded pkcs8 v0.10.2
#56 4.180   Downloaded pkcs1 v0.7.5
#56 4.185   Downloaded pin-utils v0.1.0
#56 4.188   Downloaded pin-project-lite v0.2.16
#56 4.200   Downloaded percent-encoding v2.3.2
#56 4.202   Downloaded pem-rfc7468 v0.7.0
#56 4.205   Downloaded pem v3.0.5
#56 4.209   Downloaded parking_lot_core v0.9.11
#56 4.216   Downloaded parking_lot v0.12.4
#56 4.222   Downloaded parking v2.2.1
#56 4.225   Downloaded openssl-macros v0.1.1
#56 4.229   Downloaded once_cell v1.21.3
#56 4.234   Downloaded num-traits v0.2.19
#56 4.239   Downloaded num-iter v0.1.45
#56 4.241   Downloaded log v0.4.27
#56 4.246   Downloaded lock_api v0.4.13
#56 4.250   Downloaded litemap v0.8.0
#56 4.256   Downloaded jsonwebtoken v9.3.1
#56 4.269   Downloaded icu_provider v2.0.0
#56 4.277   Downloaded iana-time-zone v0.1.63
#56 4.283   Downloaded zstd-safe v7.2.4
#56 4.287   Downloaded zstd v0.13.3
#56 4.297   Downloaded typenum v1.18.0
#56 4.304   Downloaded tracing-attributes v0.1.30
#56 4.310   Downloaded tokio-stream v0.1.17
#56 4.325   Downloaded encoding_rs v0.8.35
#56 4.378   Downloaded nu-ansi-term v0.50.1
#56 4.385   Downloaded native-tls v0.2.14
#56 4.397   Downloaded mime v0.3.17
#56 4.402   Downloaded md-5 v0.10.6
#56 4.406   Downloaded local-channel v0.1.5
#56 4.409   Downloaded lazy_static v1.5.0
#56 4.414   Downloaded jobserver v0.1.34
#56 4.419   Downloaded itoa v1.0.15
#56 4.423   Downloaded is_terminal_polyfill v1.70.1
#56 4.428   Downloaded ipnetwork v0.20.0
#56 4.432   Downloaded ipnet v2.11.0
#56 4.438   Downloaded inout v0.1.4
#56 4.442   Downloaded impl-more v0.1.9
#56 4.448   Downloaded idna_adapter v1.2.1
#56 4.451   Downloaded hyper-tls v0.5.0
#56 4.455   Downloaded httpdate v1.0.3
#56 4.460   Downloaded zerovec-derive v0.11.1
#56 4.464   Downloaded zeroize v1.8.1
#56 4.468   Downloaded zerofrom-derive v0.1.6
#56 4.471   Downloaded yoke-derive v0.8.0
#56 4.474   Downloaded writeable v0.6.1
#56 4.480   Downloaded whoami v1.6.1
#56 4.486   Downloaded version_check v0.9.5
#56 4.491   Downloaded utf8parse v0.2.2
#56 4.494   Downloaded utf8_iter v1.0.4
#56 4.497   Downloaded untrusted v0.9.0
#56 4.501   Downloaded unicode-xid v0.2.6
#56 4.505   Downloaded tracing-log v0.2.0
#56 4.509   Downloaded tower-service v0.3.3
#56 4.512   Downloaded tokio-retry v0.3.0
#56 4.516   Downloaded tokio-native-tls v0.3.1
#56 4.521   Downloaded tokio-macros v2.5.0
#56 4.524   Downloaded tinyvec_macros v0.1.1
#56 4.527   Downloaded time-core v0.1.4
#56 4.531   Downloaded thread_local v1.1.9
#56 4.535   Downloaded sync_wrapper v0.1.2
#56 4.537   Downloaded syn v2.0.106
#56 4.561   Downloaded sqlx v0.8.6
#56 4.590   Downloaded chrono v0.4.41
#56 4.607   Downloaded brotli v8.0.2
#56 4.642   Downloaded matchers v0.2.0
#56 4.645   Downloaded local-waker v0.1.4
#56 4.647   Downloaded zerofrom v0.1.6
#56 4.650   Downloaded yoke v0.8.0
#56 4.655   Downloaded webpki-***s v0.26.11
#56 4.660   Downloaded want v0.3.1
#56 4.664   Downloaded try-lock v0.2.5
#56 4.667   Downloaded tinystr v0.8.1
#56 4.672   Downloaded time-macros v0.2.22
#56 4.678   Downloaded thiserror-impl v2.0.16
#56 4.681   Downloaded synstructure v0.13.2
#56 4.684   Downloaded sqlx-sqlite v0.8.6
#56 4.694   Downloaded sqlx-postgres v0.8.6
#56 4.713   Downloaded sqlx-mysql v0.8.6
#56 4.737   Downloaded sqlx-macros-core v0.8.6
#56 4.737   Downloaded sqlx-core v0.8.6
#56 4.763   Downloaded spki v0.7.3
#56 4.781   Downloaded hkdf v0.12.4
#56 4.786   Downloaded hashbrown v0.15.5
#56 4.799   Downloaded h2 v0.3.27
#56 4.817   Downloaded futures-util v0.3.31
#56 4.850   Downloaded combine v4.6.7
#56 4.863   Downloaded cc v1.2.34
#56 4.872   Downloaded brotli-decompressor v5.0.0
#56 4.885   Downloaded base64 v0.22.1
#56 4.896   Downloaded aho-corasick v1.1.3
#56 4.910   Downloaded actix-http v3.11.1
#56 4.961   Downloaded subtle v2.6.1
#56 4.974   Downloaded stringprep v0.1.5
#56 4.974   Downloaded stable_deref_trait v1.2.0
#56 4.974   Downloaded sqlx-macros v0.8.6
#56 4.974   Downloaded smallvec v1.15.1
#56 4.974   Downloaded httparse v1.10.1
#56 4.982   Downloaded http v0.2.12
#56 4.991   Downloaded hmac v0.12.1
#56 4.998   Downloaded hashlink v0.10.0
#56 5.003   Downloaded getrandom v0.3.3
#56 5.014   Downloaded getrandom v0.2.16
#56 5.022   Downloaded futures-intrusive v0.5.0
#56 5.033   Downloaded futures v0.3.31
#56 5.054   Downloaded flume v0.11.1
#56 5.065   Downloaded flate2 v1.1.2
#56 5.080   Downloaded event-listener v5.4.1
#56 5.093   Downloaded dotenvy v0.15.7
#56 5.098   Downloaded derive_more-impl v2.0.1
#56 5.111   Downloaded derive_more v2.0.1
#56 5.132   Downloaded der v0.7.10
#56 5.146   Downloaded crossbeam-channel v0.5.15
#56 5.156   Downloaded crc32fast v1.5.0
#56 5.161   Downloaded const-oid v0.9.6
#56 5.165   Downloaded bytes v1.10.1
#56 5.174   Downloaded bitflags v2.9.3
#56 5.182   Downloaded base64 v0.21.7
#56 5.190   Downloaded arc-swap v1.7.1
#56 5.198   Downloaded home v0.5.11
#56 5.200   Downloaded heck v0.5.0
#56 5.204   Downloaded generic-array v0.14.7
#56 5.208   Downloaded futures-sink v0.3.31
#56 5.212   Downloaded futures-macro v0.3.31
#56 5.215   Downloaded futures-io v0.3.31
#56 5.218   Downloaded futures-executor v0.3.31
#56 5.222   Downloaded futures-core v0.3.31
#56 5.227   Downloaded futures-channel v0.3.31
#56 5.233   Downloaded form_urlencoded v1.2.2
#56 5.236   Downloaded foldhash v0.1.5
#56 5.240   Downloaded fnv v1.0.7
#56 5.243   Downloaded env_logger v0.11.8
#56 5.250   Downloaded env_filter v0.1.3
#56 5.254   Downloaded either v1.15.0
#56 5.258   Downloaded dotenv v0.15.0
#56 5.263   Downloaded displaydoc v0.2.5
#56 5.270   Downloaded digest v0.10.7
#56 5.275   Downloaded deranged v0.4.0
#56 5.279   Downloaded crypto-common v0.1.6
#56 5.283   Downloaded crossbeam-queue v0.3.12
#56 5.287   Downloaded crc-catalog v2.4.0
#56 5.291   Downloaded crc v3.3.0
#56 5.295   Downloaded cpufeatures v0.2.17
#56 5.299   Downloaded cookie v0.16.2
#56 5.305   Downloaded concurrent-queue v2.5.0
#56 5.310   Downloaded colorchoice v1.0.4
#56 5.313   Downloaded cipher v0.4.4
#56 5.317   Downloaded cfg-if v1.0.3
#56 5.321   Downloaded bytestring v1.4.0
#56 5.323   Downloaded block-buffer v0.10.4
#56 5.326   Downloaded bcrypt v0.15.1
#56 5.329   Downloaded base64ct v1.8.0
#56 5.336   Downloaded autocfg v1.5.0
#56 5.342   Downloaded atoi v2.0.0
#56 5.348   Downloaded async-trait v0.1.89
#56 5.357   Downloaded anyhow v1.0.99
#56 5.364   Downloaded anstyle-query v1.1.4
#56 5.369   Downloaded anstyle-parse v0.2.7
#56 5.383   Downloaded anstream v0.6.20
#56 5.389   Downloaded adler2 v2.0.1
#56 5.401   Downloaded actix_derive v0.6.2
#56 5.402   Downloaded actix-web-codegen v4.3.0
#56 5.424   Downloaded actix-utils v3.0.1
#56 5.438   Downloaded actix-rt v2.10.0
#56 5.444   Downloaded actix-router v0.5.3
#56 5.450   Downloaded actix v0.13.5
#56 5.463   Downloaded hex v0.4.3
#56 5.469   Downloaded futures-task v0.3.31
#56 5.473   Downloaded foreign-types-shared v0.1.1
#56 5.476   Downloaded equivalent v1.0.2
#56 5.478   Downloaded byteorder v1.5.0
#56 5.482   Downloaded blowfish v0.9.1
#56 5.486   Downloaded anstyle v1.0.11
#56 5.489   Downloaded allocator-api2 v0.2.21
#56 5.496   Downloaded alloc-stdlib v0.2.2
#56 5.499   Downloaded alloc-no-stdlib v2.0.4
#56 5.504   Downloaded actix-cors v0.7.1
#56 5.509   Downloaded crossbeam-utils v0.8.21
#56 5.517   Downloaded libsqlite3-sys v0.30.1
#56 5.914    Compiling proc-macro2 v1.0.101
#56 5.914    Compiling unicode-ident v1.0.18
#56 6.109    Compiling libc v0.2.175
#56 6.809    Compiling serde v1.0.219
#56 8.831    Compiling quote v1.0.40
#56 9.567    Compiling syn v2.0.106
#56 9.821    Compiling cfg-if v1.0.3
#56 9.895    Compiling autocfg v1.5.0
#56 13.72    Compiling jobserver v0.1.34
#56 14.64    Compiling shlex v1.3.0
#56 15.01    Compiling cc v1.2.34
#56 19.13    Compiling version_check v0.9.5
#56 19.65    Compiling typenum v1.18.0
#56 20.24    Compiling generic-array v0.14.7
#56 20.56    Compiling synstructure v0.13.2
#56 21.82    Compiling lock_api v0.4.13
#56 22.11    Compiling parking_lot_core v0.9.11
#56 22.42    Compiling pin-project-lite v0.2.16
#56 22.51    Compiling log v0.4.27
#56 22.95    Compiling memchr v2.7.5
#56 25.23    Compiling futures-core v0.3.31
#56 25.26    Compiling serde_derive v1.0.219
#56 25.48    Compiling zerofrom-derive v0.1.6
#56 28.92    Compiling yoke-derive v0.8.0
#56 31.85    Compiling zerovec-derive v0.11.1
#56 34.98    Compiling displaydoc v0.2.5
#56 36.96    Compiling bytes v1.10.1
#56 39.57    Compiling scopeguard v1.2.0
#56 40.33    Compiling icu_normalizer_data v2.0.0
#56 40.66    Compiling icu_properties_data v2.0.1
#56 40.97    Compiling tracing-attributes v0.1.30
#56 42.80    Compiling smallvec v1.15.1
#56 44.38    Compiling parking_lot v0.12.4
#56 44.76    Compiling zerocopy v0.8.26
#56 45.61    Compiling once_cell v1.21.3
#56 46.13    Compiling tokio-macros v2.5.0
#56 46.35    Compiling mio v1.0.4
#56 48.02    Compiling signal-hook-registry v1.4.6
#56 48.07    Compiling socket2 v0.6.0
#56 49.63    Compiling futures-sink v0.3.31
#56 49.92    Compiling tokio v1.47.1
#56 50.38    Compiling zerofrom v0.1.6
#56 50.76    Compiling stable_deref_trait v1.2.0
#56 50.86    Compiling itoa v1.0.15
#56 51.13    Compiling yoke v0.8.0
#56 62.24    Compiling crossbeam-utils v0.8.21
#56 62.80    Compiling pkg-config v0.3.32
#56 67.28    Compiling zerovec v0.11.4
#56 71.00    Compiling futures-channel v0.3.31
#56 71.60    Compiling tracing-core v0.1.34
#56 73.68    Compiling futures-macro v0.3.31
#56 75.80    Compiling futures-io v0.3.31
#56 75.87    Compiling futures-task v0.3.31
#56 76.08    Compiling pin-utils v0.1.0
#56 76.14    Compiling slab v0.4.11
#56 76.51    Compiling futures-util v0.3.31
#56 78.67    Compiling crypto-common v0.1.6
#56 78.85    Compiling serde_json v1.0.143
#56 79.11    Compiling tracing v0.1.41
#56 79.90    Compiling tinystr v0.8.1
#56 80.33    Compiling litemap v0.8.0
#56 80.84    Compiling subtle v2.6.1
#56 81.18    Compiling writeable v0.6.1
#56 82.11    Compiling icu_locale_core v2.0.0
#56 86.07    Compiling potential_utf v0.1.3
#56 86.24    Compiling zerotrie v0.2.2
#56 86.48    Compiling getrandom v0.2.16
#56 86.83    Compiling equivalent v1.0.2
#56 86.93    Compiling thiserror v2.0.16
#56 87.06    Compiling allocator-api2 v0.2.21
#56 87.49    Compiling foldhash v0.1.5
#56 87.87    Compiling icu_provider v2.0.0
#56 88.00    Compiling hashbrown v0.15.5
#56 90.44    Compiling icu_collections v2.0.0
#56 92.14    Compiling block-buffer v0.10.4
#56 92.88    Compiling getrandom v0.3.3
#56 93.87    Compiling bitflags v2.9.3
#56 94.43    Compiling percent-encoding v2.3.2
#56 96.95    Compiling ppv-lite86 v0.2.21
#56 98.28    Compiling digest v0.10.7
#56 98.98    Compiling tokio-util v0.7.16
#56 99.94    Compiling thiserror-impl v2.0.16
#56 101.4    Compiling num-traits v0.2.19
#56 101.7    Compiling rustls v0.23.31
#56 103.7    Compiling icu_properties v2.0.1
#56 104.3    Compiling icu_normalizer v2.0.0
#56 109.3    Compiling indexmap v2.11.0
#56 109.5    Compiling ring v0.17.14
#56 113.7    Compiling vcpkg v0.2.15
#56 116.9    Compiling fnv v1.0.7
#56 117.1    Compiling zeroize v1.8.1
#56 117.1    Compiling ryu v1.0.20
#56 117.5    Compiling rustls-pki-types v1.12.0
#56 117.8    Compiling openssl-sys v0.9.109
#56 118.9    Compiling http v0.2.12
#56 125.2    Compiling idna_adapter v1.2.1
#56 127.6    Compiling form_urlencoded v1.2.2
#56 128.1    Compiling aho-corasick v1.1.3
#56 130.3    Compiling base64 v0.22.1
#56 131.7    Compiling utf8_iter v1.0.4
#56 132.0    Compiling regex-syntax v0.8.6
#56 137.0    Compiling idna v1.1.0
#56 140.5    Compiling regex-automata v0.4.10
#56 168.3    Compiling zstd-sys v2.0.15+zstd.1.5.7
#56 169.1    Compiling httparse v1.10.1
#56 169.9    Compiling cpufeatures v0.2.17
#56 170.0    Compiling untrusted v0.9.0
#56 192.5    Compiling url v2.5.7
#56 201.4    Compiling tinyvec_macros v0.1.1
#56 203.5    Compiling powerfmt v0.2.0
#56 204.0    Compiling num-conv v0.1.0
#56 204.3    Compiling time-core v0.1.4
#56 214.2    Compiling time-macros v0.2.22
#56 217.7    Compiling deranged v0.4.0
#56 221.7    Compiling tinyvec v1.10.0
#56 239.2    Compiling rustls-webpki v0.103.4
#56 242.7    Compiling concurrent-queue v2.5.0
#56 243.2    Compiling h2 v0.3.27
#56 263.8    Compiling webpki-***s v1.0.2
#56 264.0    Compiling rand_core v0.6.4
#56 265.3    Compiling socket2 v0.5.10
#56 265.6    Compiling foreign-types-shared v0.1.1
#56 266.0    Compiling openssl v0.10.73
#56 266.3    Compiling httpdate v1.0.3
#56 267.2    Compiling zstd-safe v7.2.4
#56 267.4    Compiling local-waker v0.1.4
#56 267.6    Compiling parking v2.2.1
#56 267.8    Compiling crc32fast v1.5.0
#56 267.8    Compiling iana-time-zone v0.1.63
#56 268.2    Compiling alloc-no-stdlib v2.0.4
#56 268.4    Compiling crc-catalog v2.4.0
#56 272.5    Compiling crc v3.3.0
#56 272.9    Compiling alloc-stdlib v0.2.2
#56 273.1    Compiling chrono v0.4.41
#56 276.8    Compiling sha2 v0.10.9
#56 277.1    Compiling event-listener v5.4.1
#56 277.6    Compiling time v0.3.41
#56 277.8    Compiling foreign-types v0.3.2
#56 278.2    Compiling rand_chacha v0.3.1
#56 281.2    Compiling webpki-***s v0.26.11
#56 286.1    Compiling futures-intrusive v0.5.0
#56 287.4    Compiling tokio-stream v0.1.17
#56 288.8    Compiling unicode-normalization v0.1.24
#56 292.9    Compiling hashlink v0.10.0
#56 296.7    Compiling crossbeam-queue v0.3.12
#56 297.0    Compiling regex v1.11.2
#56 298.4    Compiling hmac v0.12.1
#56 298.6    Compiling rand_core v0.9.3
#56 299.0    Compiling actix-rt v2.10.0
#56 299.2    Compiling either v1.15.0
#56 299.8    Compiling openssl-macros v0.1.1
#56 300.7    Compiling native-tls v0.2.14
#56 301.1    Compiling uuid v1.18.0
#56 302.0    Compiling adler2 v2.0.1
#56 302.2    Compiling unicode-properties v0.1.3
#56 303.7    Compiling unicode-xid v0.2.6
#56 303.9    Compiling unicode-bidi v0.3.18
#56 305.2    Compiling stringprep v0.1.5
#56 305.5    Compiling derive_more-impl v2.0.1
#56 307.5    Compiling sqlx-core v0.8.6
#56 313.7    Compiling miniz_oxide v0.8.9
#56 317.0    Compiling rand_chacha v0.9.0
#56 319.0    Compiling hkdf v0.12.4
#56 319.2    Compiling rand v0.8.5
#56 324.3    Compiling brotli-decompressor v5.0.0
#56 328.5    Compiling actix-utils v3.0.1
#56 330.2    Compiling atoi v2.0.0
#56 330.9    Compiling md-5 v0.10.6
#56 331.2    Compiling bytestring v1.4.0
#56 331.9    Compiling actix-service v2.0.3
#56 333.2    Compiling cookie v0.16.2
#56 333.6    Compiling encoding_rs v0.8.35
#56 333.7    Compiling whoami v1.6.1
#56 334.4    Compiling mime v0.3.17
#56 335.2    Compiling openssl-probe v0.1.6
#56 335.8    Compiling home v0.5.11
#56 336.0    Compiling byteorder v1.5.0
#56 336.6    Compiling regex-lite v0.1.7
#56 338.8    Compiling try-lock v0.2.5
#56 338.9    Compiling dotenvy v0.15.7
#56 340.6    Compiling hex v0.4.3
#56 341.3    Compiling sqlx-postgres v0.8.6
#56 349.9    Compiling want v0.3.1
#56 350.3    Compiling actix-router v0.5.3
#56 360.6    Compiling brotli v8.0.2
#56 373.8    Compiling flate2 v1.1.2
#56 375.4    Compiling zstd v0.13.3
#56 376.4    Compiling rand v0.9.2
#56 378.5    Compiling derive_more v2.0.1
#56 380.2    Compiling local-channel v0.1.5
#56 380.4    Compiling sha1 v0.10.6
#56 383.0    Compiling num-integer v0.1.46
#56 384.1    Compiling serde_urlencoded v0.7.1
#56 384.7    Compiling http-body v0.4.6
#56 386.2    Compiling actix-codec v0.5.2
#56 387.2    Compiling inout v0.1.4
#56 389.5    Compiling actix-macros v0.2.4
#56 389.6    Compiling pin-project-internal v1.1.10
#56 392.7    Compiling language-tags v0.3.2
#56 396.0    Compiling heck v0.5.0
#56 396.1    Compiling tower-service v0.3.3
#56 396.4    Compiling utf8parse v0.2.2
#56 396.5    Compiling anstyle-parse v0.2.7
#56 397.0    Compiling hyper v0.14.32
#56 402.0    Compiling sqlx-macros-core v0.8.6
#56 404.9    Compiling actix-http v3.11.1
#56 432.0    Compiling pin-project v1.1.10
#56 458.6    Compiling cipher v0.4.4
#56 459.6    Compiling num-bigint v0.4.6
#56 463.5    Compiling tokio-native-tls v0.3.1
#56 464.0    Compiling actix-web-codegen v4.3.0
#56 467.2    Compiling actix-server v2.6.0
#56 471.2    Compiling futures-executor v0.3.31
#56 472.3    Compiling impl-more v0.1.9
#56 472.4    Compiling is_terminal_polyfill v1.70.1
#56 472.5    Compiling anstyle-query v1.1.4
#56 472.7    Compiling colorchoice v1.0.4
#56 472.8    Compiling anstyle v1.0.11
#56 475.5    Compiling base64 v0.21.7
#56 477.1    Compiling lazy_static v1.5.0
#56 479.1    Compiling anyhow v1.0.99
#56 481.8    Compiling sharded-slab v0.1.7
#56 484.2    Compiling rustls-pemfile v1.0.4
#56 484.8    Compiling anstream v0.6.20
#56 485.8    Compiling actix-web v4.11.0
#56 508.6    Compiling futures v0.3.31
#56 508.7    Compiling simple_asn1 v0.6.3
#56 511.0    Compiling hyper-tls v0.5.0
#56 511.5    Compiling blowfish v0.9.1
#56 511.9    Compiling tokio-retry v0.3.0
#56 512.3    Compiling sqlx-macros v0.8.6
#56 514.5    Compiling env_filter v0.1.3
#56 515.8    Compiling crossbeam-channel v0.5.15
#56 517.3    Compiling matchers v0.2.0
#56 517.5    Compiling pem v3.0.5
#56 518.7    Compiling combine v4.6.7
#56 533.3    Compiling tracing-log v0.2.0
#56 533.9    Compiling actix_derive v0.6.2
#56 535.0    Compiling async-trait v0.1.89
#56 535.1    Compiling socket2 v0.4.10
#56 536.1    Compiling thread_local v1.1.9
#56 536.7    Compiling jiff v0.2.15
#56 537.5    Compiling arc-swap v1.7.1
#56 538.2    Compiling nu-ansi-term v0.50.1
#56 539.1    Compiling ipnet v2.11.0
#56 541.1    Compiling sync_wrapper v0.1.2
#56 541.3    Compiling sha1_smol v1.0.1
#56 541.8    Compiling redis v0.24.0
#56 560.0    Compiling env_logger v0.11.8
#56 562.3    Compiling reqwest v0.11.27
#56 567.0    Compiling tracing-subscriber v0.3.20
#56 577.4    Compiling actix v0.13.5
#56 580.1    Compiling jsonwebtoken v9.3.1
#56 585.1    Compiling sqlx v0.8.6
#56 585.2    Compiling bcrypt v0.15.1
#56 585.8    Compiling actix-cors v0.7.1
#56 589.0    Compiling ipnetwork v0.20.0
#56 589.5    Compiling dotenv v0.15.0
#56 590.7    Compiling viworks-admin-backend v0.1.0 (/app)
#56 599.7     Finished `release` profile [optimized] target(s) in 9m 59s
#56 599.7 warning: the following packages contain code that will be rejected by a future version of Rust: redis v0.24.0
#56 599.7 note: to see what the problems were, use the option `--future-incompat-report`, or run `cargo report future-incompatibilities --id 1`
#56 DONE 600.1s
#57 [backend builder  8/11] RUN rm src/main.rs
#57 DONE 0.2s
#58 [backend builder  9/11] COPY src ./src
#58 DONE 0.0s
#59 [backend builder 10/11] COPY migrations ./migrations
#59 DONE 0.0s
#60 [backend builder 11/11] RUN cargo build --release
#60 1.077     Finished `release` profile [optimized] target(s) in 0.75s
#60 1.077 warning: the following packages contain code that will be rejected by a future version of Rust: redis v0.24.0
#60 1.101 note: to see what the problems were, use the option `--future-incompat-report`, or run `cargo report future-incompatibilities --id 1`
#60 DONE 1.2s
#61 [backend stage-1 6/7] COPY ops/entrypoint.sh /app/entrypoint.sh
#61 CACHED
#62 [backend stage-1 2/7] RUN apk add --no-cache     ca-certificates     dumb-init     busybox-extras     netcat-openbsd     wget     curl     tzdata     bash     postgresql-client     redis
#62 CACHED
#63 [backend stage-1 4/7] COPY --from=builder /app/target/release/viworks-admin-backend /app/app
#63 CACHED
#64 [backend stage-1 5/7] COPY --from=builder /app/migrations /app/migrations
#64 CACHED
#65 [backend stage-1 3/7] WORKDIR /app
#65 CACHED
#66 [backend stage-1 7/7] RUN adduser -D -u 10001 appuser &&     chown -R appuser:appuser /app &&     chmod +x /app/entrypoint.sh
#66 CACHED
#67 [backend] exporting to image
#67 exporting layers done
#67 writing image sha256:d765908d6dc1e427d776aabd72e0304669172303cecc779de90b8d6cebc35dcf 0.0s done
#67 naming to docker.io/library/digitaloceandocker-backend done
#67 DONE 0.1s
#68 [backend] resolving provenance for metadata file
#68 DONE 0.0s
 digitaloceandocker-backend  Built
 digitaloceandocker-frontend  Built
 digitaloceandocker-website  Built
 Container viworks-redis  Creating
 Container viworks-website  Creating
 Container viworks-postgres  Creating
 Container viworks-redis  Created
 Container viworks-website  Created
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
Temporarily overriding HOME='/home/runner/work/_temp/a219bed1-bf00-4cd9-9946-0e69aa55ecdc' before making global git config changes
Adding repository directory to the temporary git global config as a safe directory
/usr/bin/git config --global --add safe.directory /home/runner/work/viworkdemo002/viworkdemo002
/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
http.https://github.com/.extraheader
/usr/bin/git config --local --unset-all http.https://github.com/.extraheader
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
