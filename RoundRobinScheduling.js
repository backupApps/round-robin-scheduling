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

function roundRobin(processes, quantum) {
  let time = 0;
  let queue = [...processes];

  queue.sort((a, b) => a.arrivalTime - b.arrivalTime);

  function executeNextProcess() {
      if (queue.length === 0) return;

      const currentProcess = queue.shift();
      const executionTime = Math.min(quantum, currentProcess.remainingTime);
      console.log(`Time ${time} - ${time + executionTime} ms: Executing ${currentProcess.name} (${executionTime} units)`);

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
        
        console.log("Done!")
        console.log("")

        // Menampilkan hasil tiap-tiap proses 
        console.log("Completion Times:");
        processes.forEach(process => {
          console.log(`${process.name}: ${process.completionTime} ms`);
        }); console.log("")
        
        console.log("Turn Around Times:");
        processes.forEach(process => {
          console.log(`${process.name}: ${process.turnAroundTime} ms`);
        }); console.log("")

        console.log("Waiting Times:");
        processes.forEach(process => {
          const waitingTime = process.waitingTime < 0 ? 0 : process.waitingTime; // Jika waitingTime kurang dari 0, ubah menjadi 0 (menghindari nilai negatif)
          console.log(`${process.name}: ${waitingTime} ms`);
        }); console.log("")
        
        // Menampilkan jumlah dari hasil tiap-tiap waktu proses
        console.log(`Total Completion Time: ${totalCompletionTime} ms`); // Mencetak total completion time
        console.log(`Total Turn Around Time: ${totalTurnAroundTime} ms`);

        const sumWaitingTime = totalWaitingTime < 0 ? 0 : totalWaitingTime; 
        console.log(`Total Waiting Time: ${sumWaitingTime} ms`);
        console.log("");

        // Menghitung Average Turn Around Time (ATAT)
        const averageTurnAroundTime = totalTurnAroundTime / processes.length;
        console.log(`Average Turn Around Time: ${averageTurnAroundTime.toFixed(2)} ms`);

        // Menghitung Average Waiting Time (AWT)
        const averageWaitingTime = sumWaitingTime / processes.length;
        console.log(`Average Waiting Time: ${averageWaitingTime < 0 ? 0 : averageWaitingTime.toFixed(2)} ms`);
    }

    setTimeout(executeNextProcess, 4);
  }

  executeNextProcess();
}

function main() {
  const processes = [
      new Process("P1", 1, 4),
      new Process("P2", 3, 7),
      new Process("P3", 0, 6),
      new Process("P4", 4, 4),
      new Process("P5", 5, 3),
  ];
  const quantum = 4;
  console.log("Round-Robin Scheduling:");
  roundRobin(processes, quantum);
}

main();
