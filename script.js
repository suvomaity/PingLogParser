

function processFile() {
    const fileInput = document.getElementById('fileInput');
    const resultElement = document.getElementById('result');
    const totalRowsElement = document.getElementById('totalRows');
    const countElement = document.getElementById('count');
    const timeoutCountElement = document.getElementById('timeoutCount');

    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const fileContent = event.target.result;
            const lines = fileContent.split('\n');
            let highestTime = null;
            let rowCount = lines.length;
            let countBetween2And99ms = 0;
            let timeoutCount = 0;

            lines.forEach(function(line) {
                const match = line.match(/time[<|=]?([\d.]+)ms/);
                if (match) {
                    const time = parseFloat(match[1]);
                    if (highestTime === null || time > highestTime) {
                        highestTime = time;
                    }
                    if (time >= 2 && time <= 99) {
                        countBetween2And99ms++;
                    }
                }
                if (line.includes('Request timed out')) {
                    timeoutCount++;
                }
            });

            if (highestTime !== null) {
                resultElement.textContent = `Highest Time : ${highestTime} ms`;
            } else {
                resultElement.textContent = "No valid time values found in the file.";
            }

            totalRowsElement.textContent = `Total Rows: ${rowCount}`;
            countElement.textContent = `Count (2ms to 99ms): ${countBetween2And99ms}`;
            timeoutCountElement.textContent = `Timeout Count: ${timeoutCount}`;
        };

        reader.readAsText(file);
    } else {
        resultElement.textContent = "Please select a file.";
        totalRowsElement.textContent = "";
        countElement.textContent = "";
        timeoutCountElement.textContent = "";
    }
}

function displayTimeoutDateTimes() {
    const fileInput = document.getElementById('fileInput');
    const timeoutTableBody = document.getElementById('timeoutTableBody');

    timeoutTableBody.innerHTML = ''; // Clear previous table rows

    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const fileContent = event.target.result;
            const lines = fileContent.split('\n');
            const timeoutDateTimes = [];

            lines.forEach(function(line) {
                if (line.includes('Request timed out.')) {
                    //const match = line.match(/time[<|=]?([\d.]+)ms/);
                    const match = line.match(/(\d+-\d+-\d+\s+\d+:\d+:\d+\.\d+)/);

                    if ( match) {
                        const dateTime = match[1];
                        timeoutDateTimes.push({
                            timeoutDateTime: dateTime
                        });
                    }
                }
            });
            //alert(timeoutDateTimes.length);
            if (timeoutDateTimes.length > 0) {
                timeoutDateTimes.forEach(function(entry) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${entry.timeoutDateTime}</td>
                    `;
                    timeoutTableBody.appendChild(row);
                });
            } else {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="1">No timeouts found in the file.</td>
                `;
                timeoutTableBody.appendChild(row);
            }
        };

        reader.readAsText(file);
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="1">Please select a file.</td>
        `;
        timeoutTableBody.appendChild(row);
    }
}






function displayTimesGreaterThanThreshold() {
    const fileInput = document.getElementById('fileInput');
    const thresholdSelect = document.getElementById('thresholdSelect');
    const selectedThreshold = parseInt(thresholdSelect.value);
    const thresholdTableBody = document.getElementById('thresholdTableBody');

    thresholdTableBody.innerHTML = ''; // Clear previous table rows

    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const fileContent = event.target.result;
            const lines = fileContent.split('\n');
            const timesGreaterThanThreshold = [];

            lines.forEach(function(line) {
                if (line.includes('time=')) {
                    const startIndex = line.indexOf('time=') + 5;
                    const endIndex = line.indexOf('ms', startIndex);
                    if (startIndex < endIndex) {
                        const timeString = line.slice(startIndex, endIndex);
                        const time = parseInt(timeString);
                        if (!isNaN(time) && time > selectedThreshold) {
                            const dateTime = line.substr(0, 23); // Assuming the date and time format is consistent
                            timesGreaterThanThreshold.push({
                                thresholdTime: `${time}ms`,
                                fileDateTime: dateTime
                            });
                        }
                    }
                }
            });

            // Sort the array in ascending order based on thresholdTime
            timesGreaterThanThreshold.sort((a, b) => parseInt(a.thresholdTime) - parseInt(b.thresholdTime));

            if (timesGreaterThanThreshold.length > 0) {
                timesGreaterThanThreshold.forEach(function(entry) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${entry.thresholdTime}</td>
                        <td>${entry.fileDateTime}</td>
                    `;
                    thresholdTableBody.appendChild(row);
                });
            } else {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="2">No times > ${selectedThreshold}ms found in the file.</td>
                `;
                thresholdTableBody.appendChild(row);
            }
        };

        reader.readAsText(file);
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="2">Please select a file.</td>
        `;
        thresholdTableBody.appendChild(row);
    }
}





// function displayTimesGreaterThanThreshold() {
//     const fileInput = document.getElementById('fileInput');
//     const thresholdSelect = document.getElementById('thresholdSelect');
//     const selectedThreshold = parseInt(thresholdSelect.value);
//     const thresholdTableBody = document.getElementById('thresholdTableBody');

//     thresholdTableBody.innerHTML = ''; // Clear previous table rows

//     const file = fileInput.files[0];
//     if (file) {
//         const reader = new FileReader();

//         reader.onload = function(event) {
//             const fileContent = event.target.result;
//             const lines = fileContent.split('\n');
//             const timesGreaterThanThreshold = [];

//             lines.forEach(function(line) {
//                 const match = line.match(/(\d+-\d+-\d+ \d+:\d+:\d+\.\d+)\s+Reply\s+from\s+\d+\.\d+\.\d+\.\d+:\s+bytes=32\s+time[<|=]?([\d.]+)ms/);
//                 if (match) {
//                     const dateTime = match[1];
//                     const time = parseFloat(match[2]);
//                     if (!isNaN(time) && time > selectedThreshold) {
//                         timesGreaterThanThreshold.push({
//                             thresholdTime: `${time}ms`,
//                             fileDateTime: dateTime
//                         });
//                     }
//                 }
//             });
//             timesGreaterThanThreshold.sort((a, b) => parseFloat(a.thresholdTime) - parseFloat(b.thresholdTime));
//             if (timesGreaterThanThreshold.length > 0) {
//                 timesGreaterThanThreshold.forEach(function(entry) {
//                     const row = document.createElement('tr');
//                     row.innerHTML = `
//                         <td>${entry.thresholdTime}</td>
//                         <td>${entry.fileDateTime}</td>
//                     `;
//                     thresholdTableBody.appendChild(row);
//                 });
//             } else {
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td colspan="2">No times > ${selectedThreshold}ms found in the file.</td>
//                 `;
//                 thresholdTableBody.appendChild(row);
//             }
//         };

//         reader.readAsText(file);
//     } else {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td colspan="2">Please select a file.</td>
//         `;
//         thresholdTableBody.appendChild(row);
//     }
// }

// function displayTimeoutDateTimes() {
//     const fileInput = document.getElementById('fileInput');
//     const timeoutTableBody = document.getElementById('timeoutTableBody');

//     timeoutTableBody.innerHTML = ''; // Clear previous table rows

//     const file = fileInput.files[0];
//     if (file) {
//         const reader = new FileReader();

//         reader.onload = function(event) {
//             const fileContent = event.target.result;
//             const lines = fileContent.split('\n');
//             const timeoutDateTimes = [];

//             const regex = /^(\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}:\d{2}\.\d{2,3})/;
            
//             lines.forEach(function(line) {
//                 const match = line.match(regex);
//                 if (match) {
//                     const dateTime = match[1];
//                     timeoutDateTimes.push({
//                         timeoutDateTime: dateTime
//                     });
//                 }
//             });

//             if (timeoutDateTimes.length > 0) {
//                 timeoutDateTimes.forEach(function(entry) {
//                     const row = document.createElement('tr');
//                     row.innerHTML = `
//                         <td>${entry.timeoutDateTime}</td>
//                     `;
//                     timeoutTableBody.appendChild(row);
//                 });
//             } else {
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td colspan="1">No timeouts found in the file.</td>
//                 `;
//                 timeoutTableBody.appendChild(row);
//             }
//         };

//         reader.readAsText(file);
//     } else {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td colspan="1">Please select a file.</td>
//         `;
//         timeoutTableBody.appendChild(row);
//     }
// }

// function displayTimesGreaterThanThreshold() {
//     const fileInput = document.getElementById('fileInput');
//     const thresholdSelect = document.getElementById('thresholdSelect');
//     const selectedThreshold = parseInt(thresholdSelect.value);
//     const thresholdTableBody = document.getElementById('thresholdTableBody');

//     thresholdTableBody.innerHTML = ''; // Clear previous table rows

//     const file = fileInput.files[0];
//     if (file) {
//         const reader = new FileReader();

//         reader.onload = function(event) {
//             const fileContent = event.target.result;
//             const lines = fileContent.split('\n');
//             const timesGreaterThanThreshold = [];

//             lines.forEach(function(line) {
//                 const match = line.match(/(\d+-\d+-\d+ \d+:\d+:\d+\.\d+)\s+Reply\s+from\s+\d+\.\d+\.\d+\.\d+:\s+bytes=32\s+time[<|=]?([\d.]+)ms/);
//                 if (match) {
//                     const dateTime = match[1];
//                     const time = parseFloat(match[2]);
//                     if (!isNaN(time) && time > selectedThreshold) {
//                         timesGreaterThanThreshold.push({
//                             thresholdTime: `${time}ms`,
//                             fileDateTime: dateTime
//                         });
//                     }
//                 }
//             });

//             timesGreaterThanThreshold.sort((a, b) => parseFloat(a.thresholdTime) - parseFloat(b.thresholdTime));

//             if (timesGreaterThanThreshold.length > 0) {
//                 timesGreaterThanThreshold.forEach(function(entry) {
//                     const row = document.createElement('tr');
//                     row.innerHTML = `
//                         <td>${entry.thresholdTime}</td>
//                         <td>${entry.fileDateTime}</td>
//                     `;
//                     thresholdTableBody.appendChild(row);
//                 });
//             } else {
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td colspan="2">No times > ${selectedThreshold}ms found in the file.</td>
//                 `;
//                 thresholdTableBody.appendChild(row);
//             }
//         };

//         reader.readAsText(file);
//     } else {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td colspan="2">Please select a file.</td>
//         `;
//         thresholdTableBody.appendChild(row);
//     }
// }

