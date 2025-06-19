<template>
    <div class="flex flex-col items-center bg-neutral-900 text-white w-full h-screen">
        <h2 class="text-3xl mb-6 flex-none">Create New Pilot</h2>

        <form @submit.prevent="createPilot" class="flex flex-col w-full overflow-y-auto space-y-6 px-[20vw] pb-20">

            <!-- Pilot Name -->
            <div class="flex-none">
                <label for="name" class="block mb-1 font-semibold">Pilot Name</label>
                <input v-model="name" id="name" type="text" required placeholder="Enter pilot name"
                    class="input input-bordered w-full" />
            </div>
            <div class="flex-col flex gap-6">
                <div v-for="(info, key) in classes" :key="key"
                    class="relative flex-1 flex rounded-lg bg-cover bg-center shadow-lg cursor-pointer transition-transform hover:scale-[1.01]"
                    :style="{
                        backgroundImage: `url(${info.image || '/fallback-image.png'})`,
                        border: pilotClass === key ? `3px solid ${info.color}` : '2px solid transparent',
                        boxShadow: pilotClass === key ? `0 0 8px 2px ${info.color}80` : 'none'
                    }" @click="pilotClass = key">
                    <div v-if="pilotClass === key" :style="{
                        backgroundColor: info.color + '80'
                    }" class="absolute inset-0 rounded-lg pointer-events-none"></div>

                    <div class="relative flex w-full ">
                        <!-- Left section: Icon & Info -->
                        <div class="bg-black/70 p-4 flex flex-col justify-center min-w-[200px] z-10 rounded-l-lg w-1/3">
                            <div class="flex items-center gap-3 mb-2">
                                <span class="font-[xwing] text-3xl -mt-2" :style="{ color: info.color }">{{ info.icon
                                }}</span>
                                <h3 class="text-2xl font-bold" :style="{ color: info.color }">The {{ key }}</h3>
                            </div>
                            <p class="text-sm opacity-80">{{ info.description || 'No description available.' }}</p>
                        </div>

                        <div class="flex items-center gap-3 px-4 overflow-x-auto bg-black/50 grow z-10 rounded-r-lg">
                            <div v-for="ship in info.ships.filter(s => s.rank >= 3)" :key="ship.ship"
                                class="p-2 rounded bg-neutral-800/80 text-center min-w-[120px]">
                                <div class="font-[ships] text-xl mb-1">{{ ship.icon }}</div>
                                <div class="text-[10px] flex flex-wrap justify-center font-[xwing] text-white/80">
                                    <span v-for="(slot, idx) in ship.slots" :key="idx">{{ slot }}</span>
                                </div>
                                <div class="text-[11px] mt-1">{{ ship.ship }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Starting Ship Section -->
            <div class="flex-none w-full">
                <span class="block mb-2 font-semibold">Starting Ship</span>
                <div class="flex flex-row gap-4">
                    <div v-for="ship in availableShips" :key="ship.value"
                        class="flex flex-1 items-center gap-4 p-4 rounded cursor-pointer transition-transform duration-300"
                        :class="{
                            'bg-yellow-700 border-2 border-yellow-500 shadow-[0_0_4px_1px_rgba(204,153,0,0.25)]': startingShip === ship.value,
                            'bg-neutral-800 hover:bg-yellow-700 hover:scale-[1.01]': startingShip !== ship.value
                        }" @click="startingShip = ship.value">
                        <!-- Icon -->
                        <div class="font-[ships] text-4xl w-12 text-center">
                            {{ ship.icon }}
                        </div>

                        <!-- Info Block -->
                        <div class="flex flex-col grow">
                            <div class="text-base font-semibold mb-1">{{ ship.label }}</div>

                            <!-- Slot Layout -->
                            <div class="flex flex-wrap gap-1 text-white/80 font-[xwing] text-lg mb-1">
                                <span v-for="(slot, i) in ship.slots" :key="i">{{ slot }}</span>
                            </div>

                            
                        </div>
                        <!-- Starting XP -->
                            <span class="text-sm text-yellow-300 font-semibold"><span class="font-[xwing] text-xl font-light">Ì</span>{{ ship.xp }}</span>
                    </div>
                </div>
            </div>


            <!-- Action Buttons -->
            <div class="flex-none flex justify-between gap-4 mt-4">
                <button type="button" class="btn flex-1" @click="$emit('cancel')">Cancel</button>
                <button type="submit" class="btn flex-1">Create</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import classData from "../data/classes.json";

const emit = defineEmits(["created", "cancel"]);

const classes = ref(classData);
const name = ref("");
const pilotClass = ref("");
const startingShip = ref("X-Wing");

// Just two fixed options here as per your clarification
function getRandomSlots(count = 3) {
    const slotChars = ["T", "M", "C", "S", "E", "G"];
    return Array.from({ length: count }, () => slotChars[Math.floor(Math.random() * slotChars.length)]);
}

const availableShips = [
    {
        label: "X-Wing",
        value: "X-Wing",
        icon: "x",
        slots: ["A", "P", "m", "n"],
        xp: 10
    },
    {
        label: "Y-Wing",
        value: "Y-Wing",
        icon: "y",
        slots: ["A", "P", "U", "B", "Y", "m"],
        xp: 16
    }
];


function createPilot() {
    if (!name.value || !pilotClass.value || !startingShip.value) {
        alert("Fill all fields");
        return;
    }
    const xp = startingShip.value === "X-Wing" ? 10 : 16;
    emit("created", {
        id: Date.now().toString(),
        name: name.value.trim(),
        class: pilotClass.value,
        rank: 1,
        xp,
        selectedCards: [],
        slotCards: {},
        ownedCards: [],
        ships: [startingShip.value],
        selectedShip: startingShip.value,
        slots: [],
        usedFactionSlots: {},
    });
    name.value = "";
    pilotClass.value = "";
    startingShip.value = "X-Wing";
}
</script>
