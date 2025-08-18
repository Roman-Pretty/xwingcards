<template>
  <div class="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
    <!-- Hero Section -->
    <div class="flex items-center justify-center min-h-screen px-8">
      <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left Side - Content -->
        <div class="space-y-8 flex flex-col justify-center min-h-[600px]">
          <div class="space-y-6">
            <img 
              src="../assets/logolong.png" 
              alt="X-Wing Cards Logo" 
              class="w-64 hover:scale-105 transition-transform duration-300"
            />
            <div class="space-y-4">
              <h1 class="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Your Digital Companion for 
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  HoTAC
                </span>
              </h1>
              <p class="text-xl text-neutral-300 max-w-lg">
                Manage your Heroes of the Aturi Cluster pilots with ease. Track experience, purchase cards, and stop the Empire!
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <router-link 
              to="/dashboard" 
              class="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span class="flex items-center space-x-2">
                <span>Enter Cockpit</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </span>
            </router-link>
            
            <router-link 
              to="/create-pilot" 
              class="inline-flex items-center justify-center px-8 py-4 border-2 border-neutral-600 hover:border-neutral-400 text-neutral-300 hover:text-white font-semibold rounded-xl transition-all duration-300"
            >
              Create New Pilot
            </router-link>
          </div>

          <!-- Quick Stats or Features -->
          <div class="grid grid-cols-4 gap-6 pt-8 border-t border-neutral-700">
            <div class="text-center">
              <div class="text-2xl font-bold text-yellow-400">UNLIMITED</div>
              <div class="text-sm text-neutral-400">Pilots</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-400">200+</div>
              <div class="text-sm text-neutral-400">Cards</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-400">12</div>
              <div class="text-sm text-neutral-400">Classes</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-400">100%</div>
              <div class="text-sm text-neutral-400">Free</div>
            </div>
          </div>
        </div>

        <!-- Right Side - Visual/Cards Preview -->
        <div class="space-y-6 flex flex-col justify-center min-h-[600px]">
          <!-- Credits Section - Redesigned as Cards -->
          <div class="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 rounded-2xl p-6 backdrop-blur-sm border border-neutral-700">
            <h2 class="text-xl font-semibold text-white mb-4">Built on the Foundation of</h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
                <div>
                  <div class="text-yellow-400 font-semibold">Josh Derksen</div>
                  <p class="text-neutral-400 text-sm">Creator of HotAC</p>
                </div>
                <a 
                  href="https://boardgamegeek.com/boardgamedesigner/94661/josh-derksen" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="text-white hover:text-neutral-300 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7 17L17 7"/>
                    <path d="M7 7h10v10"/>
                  </svg>
                </a>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
                <div>
                  <div class="text-yellow-400 font-semibold">Infinite Arenas</div>
                  <p class="text-neutral-400 text-sm">Community & Resources</p>
                </div>
                <a 
                  href="https://infinitearenas.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="text-white hover:text-neutral-300 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7 17L17 7"/>
                    <path d="M7 7h10v10"/>
                  </svg>
                </a>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
                <div>
                  <div class="text-yellow-400 font-semibold">Dovi Anderson</div>
                  <p class="text-neutral-400 text-sm">Designer of Base Classes and Card Edits</p>
                </div>
                <a 
                  href="https://drive.google.com/drive/folders/1R0As4XtBw-XTYm4JGBnv3D9ut7bXS6nI" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="text-white hover:text-neutral-300 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7 17L17 7"/>
                    <path d="M7 7h10v10"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Support Section - Redesigned -->
          <div class="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 rounded-2xl p-6 border border-orange-500/30">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <p class="text-white font-semibold">Enjoying the app?</p>
              </div>
              <a 
                href="https://buymeacoffee.com/romanpretty" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-block btn bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
              >
                Buy Me a Coffee ☕
              </a>
            </div>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No additional logic needed for a simple landing page
</script>

<style scoped>
.inria-sans-regular {
  font-family: 'Inria Sans', sans-serif;
  font-weight: 400;
}
</style>
