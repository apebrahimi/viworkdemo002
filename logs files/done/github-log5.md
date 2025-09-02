deploy
failed now in 23s

1s
Current runner version: '2.328.0'
Runner Image Provisioner
Operating System
Runner Image
GITHUB_TOKEN Permissions
Secret source: Actions
Prepare workflow directory
Prepare all required actions
Getting action download info
Download action repository 'actions/checkout@v4' (SHA:08eba0b27e820071cde6df949e0beb9ba4906955)
Complete job name: deploy
1s
Run actions/checkout@v4
Syncing repository: apebrahimi/viworkdemo002
Getting Git version info
Temporarily overriding HOME='/home/runner/work/_temp/178de9a0-0d6a-4211-8c86-eca3b4d612f3' before making global git config changes
Adding repository directory to the temporary git global config as a safe directory
/usr/bin/git config --global --add safe.directory /home/runner/work/viworkdemo002/viworkdemo002
Deleting the contents of '/home/runner/work/viworkdemo002/viworkdemo002'
Initializing the repository
Disabling automatic garbage collection
Setting up auth
Fetching the repository
Determining the checkout info
/usr/bin/git sparse-checkout disable
/usr/bin/git config --local --unset-all extensions.worktreeConfig
Checking out the ref
/usr/bin/git log -1 --format=%H
0535a7028c28bc0895004bd5378b3c2a8ddd4dfc
1s
Run mkdir -p ~/.ssh
# ***:22 SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.13
# ***:22 SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.13
# ***:22 SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.13
# ***:22 SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.13
# ***:22 SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.13
2s
Run ssh -o ConnectTimeout=10 -i ~/.ssh/id_ed25519 ${DROPLET_USER}@${DROPLET_IP} "echo 'SSH connection test successful'"
SSH connection test successful
0s
Run cat > deploy.sh << 'EOF'
17s
Run scp -i ~/.ssh/id_ed25519 deploy.sh ${DROPLET_USER}@${DROPLET_IP}:/tmp/
🚀 Starting ViWorks Automated Deployment...
📅 Deployment started at: Tue Sep  2 06:58:08 UTC 2025
🛑 Stopping all containers gracefully...
 Container viworks-nginx  Stopping
 Container viworks-agent  Stopping
 Container viworks-nginx  Stopped
 Container viworks-nginx  Removing
 Container viworks-agent  Stopped
 Container viworks-agent  Removing
 Container viworks-agent  Removed
 Container viworks-nginx  Removed
 Container viworks-website  Stopping
 Container viworks-frontend  Stopping
 Container viworks-frontend  Stopped
 Container viworks-frontend  Removing
 Container viworks-website  Stopped
 Container viworks-website  Removing
 Container viworks-frontend  Removed
 Container viworks-backend  Stopping
 Container viworks-website  Removed
 Container viworks-backend  Stopped
 Container viworks-backend  Removing
 Container viworks-backend  Removed
 Container viworks-postgres  Stopping
 Container viworks-redis  Stopping
 Container viworks-postgres  Stopped
 Container viworks-postgres  Removing
 Container viworks-postgres  Removed
 Container viworks-redis  Stopped
 Container viworks-redis  Removing
 Container viworks-redis  Removed
🛑 Force stopping any running containers...
🧹 Removing containers with specific names...
🧹 Removing orphaned containers...
time="2025-09-02T06:58:09Z" level=warning msg="Warning: No resource found to remove for project \"digitaloceandocker\"."
🧹 Cleaning up Docker images...
Total reclaimed space: 0B
Deleted Images:
untagged: digitaloceandocker-frontend:latest
deleted: sha256:5df242396420b99f980135e561ed081c939e3a76f937599d1f50f5dd9ca28d95
untagged: digitaloceandocker-agent:latest
deleted: sha256:c72f3fb0a5146067e1440591134c67a46d7757775718b8a075a1596f8457d136
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
deleted: sha256:e48fbc3b657cba6cae4eee23d960496857b0e131ee3680c6ed9147c51094554c
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
viworks-internal
viworks-public

🔍 Verifying no conflicting containers exist...
🧹 Cleaning up and resetting git repository...
From https://github.com/apebrahimi/viworkdemo002
   73d5a64..0535a70  main       -> origin/main
HEAD is now at 0535a70 FIX: Frontend and Nginx health check configuration
🌐 Setting up two-network security architecture...
eebc04c61f5f3783adf3d3d2f23b8958b3ff12d516d056977cfd10c110d667c3
68b95f41e4c5275d6774a5ce89c45639105d686df9859ed1668d2073d5c38340
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
 9824c27679d3 Already exists 
 61a7421693bd Pulling fs layer 
 51a939567803 Pulling fs layer 
 61a7421693bd Waiting 
 51a939567803 Waiting 
 a612d38c9b48 Pulling fs layer 
 901a9540064a Pulling fs layer 
 6c13c55b4b82 Pulling fs layer 
 0f940631c13f Pulling fs layer 
 a612d38c9b48 Waiting 
 901a9540064a Waiting 
 6c13c55b4b82 Waiting 
 0f940631c13f Waiting 
 a15854d6fd91 Pulling fs layer 
 685be96195b7 Pulling fs layer 
 ce414b3fa674 Pulling fs layer 
 a15854d6fd91 Waiting 
 685be96195b7 Waiting 
 ce414b3fa674 Waiting 
 6afcd9ec0fd9 Pulling fs layer 
 6afcd9ec0fd9 Waiting 
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
 6bc572a340ec Downloading [>                                                  ]  19.17kB/1.806MB
 6bc572a340ec Downloading [==================================================>]  1.806MB/1.806MB
 6bc572a340ec Download complete 
 6bc572a340ec Extracting [>                                                  ]  32.77kB/1.806MB
 403e3f251637 Downloading [==================================================>]     628B/628B
 403e3f251637 Download complete 
 9adfbae99cb7 Downloading [==================================================>]     955B/955B
 9adfbae99cb7 Verifying Checksum 
 9adfbae99cb7 Download complete 
 6bc572a340ec Extracting [==================================================>]  1.806MB/1.806MB
 6bc572a340ec Pull complete 
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Extracting [==================================================>]     628B/628B
 403e3f251637 Pull complete 
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Extracting [==================================================>]     955B/955B
 9adfbae99cb7 Pull complete 
 c9ebe2ff2d2c Downloading [===========================================>       ]  1.049kB/1.209kB
 a992fbc61ecc Downloading [=====================================>             ]  1.049kB/1.398kB
 c9ebe2ff2d2c Download complete 
 a992fbc61ecc Download complete 
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
 a992fbc61ecc Pull complete 
 61a7421693bd Downloading [==================================================>]     969B/969B
 61a7421693bd Verifying Checksum 
 61a7421693bd Download complete 
 61a7421693bd Extracting [==================================================>]     969B/969B
 61a7421693bd Extracting [==================================================>]     969B/969B
 cb1ff4086f82 Downloading [>                                                  ]  172.3kB/16.84MB
 51a939567803 Downloading [>                                                  ]  12.32kB/1.116MB
 61a7421693bd Pull complete 
 51a939567803 Verifying Checksum 
 51a939567803 Download complete 
 51a939567803 Extracting [=>                                                 ]  32.77kB/1.116MB
 51a939567803 Extracting [==================================================>]  1.116MB/1.116MB
 cb1ff4086f82 Downloading [====================>                              ]  7.062MB/16.84MB
 51a939567803 Pull complete 
 cb1ff4086f82 Downloading [=================================>                 ]  11.14MB/16.84MB
 cb1ff4086f82 Verifying Checksum 
 cb1ff4086f82 Download complete 
 cb1ff4086f82 Extracting [>                                                  ]  196.6kB/16.84MB
 cb1ff4086f82 Extracting [=====>                                             ]  1.966MB/16.84MB
 a612d38c9b48 Downloading [==================================================>]     175B/175B
 a612d38c9b48 Verifying Checksum 
 a612d38c9b48 Download complete 
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 a612d38c9b48 Extracting [==================================================>]     175B/175B
 901a9540064a Downloading [==================================================>]     116B/116B
 901a9540064a Verifying Checksum 
 901a9540064a Download complete 
 a612d38c9b48 Pull complete 
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Extracting [==================================================>]     116B/116B
 901a9540064a Pull complete 
 cb1ff4086f82 Extracting [===========>                                       ]  3.736MB/16.84MB
 cb1ff4086f82 Extracting [=====================>                             ]  7.274MB/16.84MB
 cb1ff4086f82 Extracting [==============================>                    ]  10.42MB/16.84MB
 6c13c55b4b82 Downloading [>                                                  ]  540.7kB/103.9MB
 cb1ff4086f82 Extracting [=====================================>             ]  12.58MB/16.84MB
 0f940631c13f Downloading [=====>                                             ]  1.049kB/9.448kB
 0f940631c13f Downloading [==================================================>]  9.448kB/9.448kB
 0f940631c13f Verifying Checksum 
 0f940631c13f Download complete 
 a15854d6fd91 Downloading [==================================================>]     129B/129B
 a15854d6fd91 Verifying Checksum 
 a15854d6fd91 Download complete 
 6c13c55b4b82 Downloading [===>                                               ]  6.406MB/103.9MB
 cb1ff4086f82 Extracting [==============================================>    ]  15.73MB/16.84MB
 6c13c55b4b82 Downloading [=====>                                             ]  11.73MB/103.9MB
 cb1ff4086f82 Extracting [==================================================>]  16.84MB/16.84MB
 6c13c55b4b82 Downloading [========>                                          ]  17.05MB/103.9MB
 cb1ff4086f82 Pull complete 
 nginx Pulled 
 6c13c55b4b82 Downloading [==========>                                        ]  21.84MB/103.9MB
 685be96195b7 Downloading [==================================================>]     171B/171B
 685be96195b7 Verifying Checksum 
 685be96195b7 Download complete 
 ce414b3fa674 Downloading [========>                                          ]  1.049kB/5.927kB
 ce414b3fa674 Downloading [==================================================>]  5.927kB/5.927kB
 ce414b3fa674 Verifying Checksum 
 ce414b3fa674 Download complete 
 6c13c55b4b82 Downloading [=============>                                     ]  27.68MB/103.9MB
 6c13c55b4b82 Downloading [===============>                                   ]  32.49MB/103.9MB
 6c13c55b4b82 Downloading [==================>                                ]  37.81MB/103.9MB
 6c13c55b4b82 Downloading [====================>                              ]  42.59MB/103.9MB
 6afcd9ec0fd9 Downloading [==================================================>]     185B/185B
 6afcd9ec0fd9 Verifying Checksum 
 6afcd9ec0fd9 Download complete 
 0368fd46e3c6 Downloading [>                                                  ]  36.88kB/3.638MB
 0368fd46e3c6 Verifying Checksum 
 0368fd46e3c6 Download complete 
 6c13c55b4b82 Downloading [=======================>                           ]  47.92MB/103.9MB
 0368fd46e3c6 Extracting [>                                                  ]  65.54kB/3.638MB
 6c13c55b4b82 Downloading [========================>                          ]  51.12MB/103.9MB
 0368fd46e3c6 Extracting [==================>                                ]  1.311MB/3.638MB
 6c13c55b4b82 Downloading [==========================>                        ]  55.38MB/103.9MB
 0368fd46e3c6 Extracting [============================================>      ]  3.211MB/3.638MB
 0368fd46e3c6 Extracting [==================================================>]  3.638MB/3.638MB
 0368fd46e3c6 Pull complete 
 6c13c55b4b82 Downloading [=============================>                     ]   60.7MB/103.9MB
 4c55286bbede Downloading [==================================================>]     950B/950B
 4c55286bbede Verifying Checksum 
 4c55286bbede Download complete 
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Extracting [==================================================>]     950B/950B
 4c55286bbede Pull complete 
 5e28347af205 Downloading [>                                                  ]  2.738kB/173.2kB
 5e28347af205 Verifying Checksum 
 5e28347af205 Download complete 
 5e28347af205 Extracting [=========>                                         ]  32.77kB/173.2kB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 6c13c55b4b82 Downloading [===============================>                   ]  66.03MB/103.9MB
 5e28347af205 Extracting [==================================================>]  173.2kB/173.2kB
 6c13c55b4b82 Downloading [=================================>                 ]  70.32MB/103.9MB
 5e28347af205 Pull complete 
 6c13c55b4b82 Downloading [====================================>              ]  75.12MB/103.9MB
 6c13c55b4b82 Downloading [======================================>            ]  80.42MB/103.9MB
 311eca34042e Downloading [>                                                  ]  10.63kB/1.003MB
 311eca34042e Verifying Checksum 
 311eca34042e Download complete 
 311eca34042e Extracting [=>                                                 ]  32.77kB/1.003MB
 6c13c55b4b82 Downloading [=========================================>         ]  85.78MB/103.9MB
 e6fe6f07e192 Downloading [>                                                  ]    127kB/12.41MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 311eca34042e Extracting [==================================================>]  1.003MB/1.003MB
 6c13c55b4b82 Downloading [===========================================>       ]  90.59MB/103.9MB
 311eca34042e Pull complete 
 e6fe6f07e192 Downloading [============================>                      ]  7.176MB/12.41MB
 e6fe6f07e192 Verifying Checksum 
 e6fe6f07e192 Download complete 
 6c13c55b4b82 Downloading [=============================================>     ]  95.38MB/103.9MB
 e6fe6f07e192 Extracting [>                                                  ]  131.1kB/12.41MB
 e6fe6f07e192 Extracting [=======>                                           ]  1.835MB/12.41MB
 6c13c55b4b82 Downloading [===============================================>   ]  99.66MB/103.9MB
 a2cadbfeca72 Downloading [==================================================>]      99B/99B
 a2cadbfeca72 Verifying Checksum 
 a2cadbfeca72 Download complete 
 6c13c55b4b82 Verifying Checksum 
 6c13c55b4b82 Download complete 
 e6fe6f07e192 Extracting [==============>                                    ]   3.67MB/12.41MB
 6c13c55b4b82 Extracting [>                                                  ]  557.1kB/103.9MB
 e6fe6f07e192 Extracting [======================>                            ]  5.505MB/12.41MB
 4f4fb700ef54 Downloading [==================================================>]      32B/32B
 4f4fb700ef54 Verifying Checksum 
 4f4fb700ef54 Download complete 
 6c13c55b4b82 Extracting [=>                                                 ]  2.228MB/103.9MB
 e6fe6f07e192 Extracting [===============================>                   ]  7.733MB/12.41MB
 6c13c55b4b82 Extracting [==>                                                ]  4.456MB/103.9MB
 e6fe6f07e192 Extracting [=======================================>           ]   9.83MB/12.41MB
 a976ed7e7808 Downloading [==================================================>]     574B/574B
 a976ed7e7808 Verifying Checksum 
 a976ed7e7808 Download complete 
 e6fe6f07e192 Extracting [==============================================>    ]  11.53MB/12.41MB
 6c13c55b4b82 Extracting [===>                                               ]  7.242MB/103.9MB
 e6fe6f07e192 Extracting [==================================================>]  12.41MB/12.41MB
 e6fe6f07e192 Pull complete 
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 6c13c55b4b82 Extracting [====>                                              ]   9.47MB/103.9MB
 a2cadbfeca72 Extracting [==================================================>]      99B/99B
 a2cadbfeca72 Pull complete 
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Extracting [==================================================>]      32B/32B
 4f4fb700ef54 Pull complete 
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 a976ed7e7808 Extracting [==================================================>]     574B/574B
 6c13c55b4b82 Extracting [=====>                                             ]  12.26MB/103.9MB
 a976ed7e7808 Pull complete 
 redis Pulled 
 6c13c55b4b82 Extracting [=======>                                           ]  15.04MB/103.9MB
 6c13c55b4b82 Extracting [========>                                          ]  17.83MB/103.9MB
 6c13c55b4b82 Extracting [==========>                                        ]  21.17MB/103.9MB
 6c13c55b4b82 Extracting [===========>                                       ]  24.51MB/103.9MB
 6c13c55b4b82 Extracting [=============>                                     ]  27.85MB/103.9MB
 6c13c55b4b82 Extracting [==============>                                    ]  30.64MB/103.9MB
 6c13c55b4b82 Extracting [================>                                  ]  33.42MB/103.9MB
 6c13c55b4b82 Extracting [=================>                                 ]  36.21MB/103.9MB
 6c13c55b4b82 Extracting [===================>                               ]  39.55MB/103.9MB
 6c13c55b4b82 Extracting [====================>                              ]  42.89MB/103.9MB
 6c13c55b4b82 Extracting [======================>                            ]  46.24MB/103.9MB
 6c13c55b4b82 Extracting [=======================>                           ]  49.02MB/103.9MB
 6c13c55b4b82 Extracting [========================>                          ]  50.69MB/103.9MB
 6c13c55b4b82 Extracting [========================>                          ]  51.81MB/103.9MB
 6c13c55b4b82 Extracting [=========================>                         ]  53.48MB/103.9MB
 6c13c55b4b82 Extracting [==========================>                        ]  55.71MB/103.9MB
 6c13c55b4b82 Extracting [============================>                      ]  59.05MB/103.9MB
 6c13c55b4b82 Extracting [=============================>                     ]  61.83MB/103.9MB
 6c13c55b4b82 Extracting [===============================>                   ]  65.18MB/103.9MB
 6c13c55b4b82 Extracting [================================>                  ]  68.52MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  72.97MB/103.9MB
 6c13c55b4b82 Extracting [===================================>               ]  74.65MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]   75.2MB/103.9MB
 6c13c55b4b82 Extracting [====================================>              ]  76.32MB/103.9MB
 6c13c55b4b82 Extracting [=====================================>             ]  77.99MB/103.9MB
 6c13c55b4b82 Extracting [======================================>            ]  80.22MB/103.9MB
 6c13c55b4b82 Extracting [=======================================>           ]  81.89MB/103.9MB
 6c13c55b4b82 Extracting [=========================================>         ]  85.23MB/103.9MB
 6c13c55b4b82 Extracting [==========================================>        ]  88.57MB/103.9MB
 6c13c55b4b82 Extracting [===========================================>       ]   90.8MB/103.9MB
 6c13c55b4b82 Extracting [=============================================>     ]  94.14MB/103.9MB
 6c13c55b4b82 Extracting [===============================================>   ]  98.04MB/103.9MB
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
#1 reading from stdin 1.95kB done
#1 DONE 0.0s
unable to prepare context: path "/opt/viworks/digital ocean docker/viworks-frontend" not found

Error: Process completed with exit code 1.
0s
0s
0s
