/* Round-Robin Scheduling */

class Process {
   constructor(name, arrivalTime, burstTime) {
       this.name = name;
       this.arrivalTime = arrivalTime;
       this.burstTime = burstTime;
       this.remainingTime = burstTime;
       this.waitingTime = 0; // Menyimpan waktu tunggu
       this.completionTime = 0; // Menyimpan waktu selesai tiap-tiap proses
       this.turnAroundTime = 0; // Menyimpan waktu tiap-tiap proses
   }
}

let numProcesses = 0;

function removeProcess() {
    const inputContainer = document.getElementById('input-container');
    if (numProcesses > 1) {
        inputContainer.removeChild(inputContainer.lastChild); // Hapus input field proses terakhir
        numProcesses--;
    }
}

function addProcess() {
    numProcesses++;
    const inputContainer = document.getElementById('input-container');

    const processInput = document.createElement('div');
    processInput.innerHTML = `
        <div class="inputan">
            <div class="name">
                <label for="process-${numProcesses}-name">Process ${numProcesses} Name:</label><br/>
                <input type="text" id="process-${numProcesses}-name" required>
            </div>
            <div class="arival-time">
                <label for="process-${numProcesses}-arrival">Arrival Time:</label><br/>
                <input type="number" id="process-${numProcesses}-arrival" required>
            </div>
            <div class="burst-time">
                <label for="process-${numProcesses}-burst">Burst Time:</label><br/>
                <input type="number" id="process-${numProcesses}-burst" required>
            </div>
        </div>
        
    `;
    inputContainer.appendChild(processInput);
}

document.addEventListener('DOMContentLoaded', function () {
    addProcess(); // Add initial process input field
});

document.getElementById('input-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const processes = [];
    for (let i = 1; i <= numProcesses; i++) {
        const name = document.getElementById(`process-${i}-name`).value;
        const arrivalTime = parseInt(document.getElementById(`process-${i}-arrival`).value);
        const burstTime = parseInt(document.getElementById(`process-${i}-burst`).value);
        processes.push(new Process(name, arrivalTime, burstTime));
    }

    const quantum = parseInt(document.getElementById('quantum').value);
    const output = document.getElementById('output');
    output.innerHTML = "<h2>Executing:</h2>";
    roundRobin(processes, quantum, output);
});

function roundRobin(processes, quantum) {
   let time = 0;
   let queue = [...processes];

    // Mengurutkan proses berdasarkan waktu tiba (arrival time)
   queue.sort((a, b) => a.arrivalTime - b.arrivalTime);

   function executeNextProcess() {
       if (queue.length === 0) return;

       const currentProcess = queue.shift();
       const executionTime = Math.min(quantum, currentProcess.remainingTime);
       const output = document.getElementById('output');
       const processOutput = document.createElement('div');
       processOutput.textContent = `Time ${time} - ${time + executionTime} ms: Executing ${currentProcess.name} (${executionTime} units)`;
       output.appendChild(processOutput);

       time += executionTime;
       currentProcess.remainingTime -= executionTime;

       // Memasukkan kembali proses yang masih memiliki sisa waktu ke antrian
       if (currentProcess.remainingTime > 0) {
           queue.push(currentProcess);
       } else {
           // Jika proses selesai,
           currentProcess.completionTime = time; // hitung completion time
           currentProcess.turnAroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
           currentProcess.waitingTime = currentProcess.turnAroundTime - currentProcess.burstTime;
       }

       if (queue.length === 0) {
           let totalCompletionTime = 0; // Inisialisasi total completion time
           let totalTurnAroundTime = 0;
           let totalWaitingTime = 0;

           // Menghitung total completion time dari semua proses
           processes.forEach(process => {
               totalCompletionTime += process.completionTime;
           });

           // Menghitung total turn around time dari semua proses
           processes.forEach(process => {
               totalTurnAroundTime += process.turnAroundTime;
           });

           // Menghitung total waiting time dari semua proses
           processes.forEach(process => {
               totalWaitingTime += process.waitingTime;
           });

           const space = document.createElement('div');
           space.textContent = "Done!";

           // Menampilkan hasil tiap-tiap proses 
           const completionTimesOutput = document.createElement('div');
           completionTimesOutput.textContent = "Completion Times:";
           output.appendChild(completionTimesOutput);
           processes.forEach(process => {
               const processOutput = document.createElement('div');
               processOutput.textContent = `${process.name}: ${process.completionTime} ms`;
               output.appendChild(processOutput);
           });

           const turnAroundTimesOutput = document.createElement('div');
           turnAroundTimesOutput.textContent = "Turn Around Times:";
           output.appendChild(turnAroundTimesOutput);
           processes.forEach(process => {
               const processOutput = document.createElement('div');
               processOutput.textContent = `${process.name}: ${process.turnAroundTime} ms`;
               output.appendChild(processOutput);
           });

           const waitingTimesOutput = document.createElement('div');
           waitingTimesOutput.textContent = "Waiting Times:";
           output.appendChild(waitingTimesOutput);
           processes.forEach(process => {
               const processOutput = document.createElement('div');
               processOutput.textContent = `${process.name}: ${process.waitingTime} ms`;
               output.appendChild(processOutput);
           });

           // Menghitung Average Turn Around Time (ATAT)
           const averageTurnAroundTime = totalTurnAroundTime / processes.length;

           // Menghitung Average Waiting Time (AWT)
           const averageWaitingTime = totalWaitingTime / processes.length;
           const averagesOutput = document.createElement('div');
           const averagesOutput2 = document.createElement('div');
           averagesOutput.textContent = `Average Turn Around Time: ${averageTurnAroundTime.toFixed(2)} ms`;
           averagesOutput2.textContent = `Average Waiting Time: ${averageWaitingTime.toFixed(2)} ms`;
           output.appendChild(averagesOutput);
           output.appendChild(averagesOutput2);

       }

       setTimeout(executeNextProcess, 400);
   }

   executeNextProcess();
}

