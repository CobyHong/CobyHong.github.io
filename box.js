var NumberofCellsButton = document.getElementById("num_cells_submit");
NumberofCellsButton.addEventListener("click", generateBoxes);
function generateBoxes(e)
{
    var integer_submission = document.getElementById("num_cells_input");
    if (integer_submission.value.length != 0)
    {
        // clear all boxes.
        document.getElementsByTagName("ul")[0].innerHTML = "";

        // add in new boxes based on user input.
        count = integer_submission.value;
        var ul = document.getElementsByTagName("ul")[0];
        
        for(var i=0; i<count; i++)
        {
            var li = document.createElement("li");
            li.setAttribute("class", "box");
            li.setAttribute("value", 0);
            ul.appendChild(li);
        }
    }
    e.preventDefault();
}


var randomizeBoxesButton = document.getElementById("random_submit");
randomizeBoxesButton.addEventListener("click", randomizeBoxes);
function randomizeBoxes(e)
{
    var boxes = document.getElementsByClassName("box");

    for(var i=0; i<boxes.length; i++)
    {
        var height = getRandomInt(0, 600);
        boxes[i].style.height = height.toString() + "px";
        boxes[i].value = height;
        boxes[i].textContent = null;

        boxes[i].style.backgroundColor = "rgba(42, 170, 138, " + (height/600).toString() + ")";
    }
    e.preventDefault();
}


var audio = new Audio('osu.wav');
audio.mozPreservesPitch = false;
var sortButton = document.getElementById("sort_submit");
sortButton.addEventListener("click", sorter);
async function sorter(e)
{
    var chosen_sort = document.getElementsByName("algorithms")[0].value;
    var boxes = document.getElementsByClassName("box");

    switch(chosen_sort)
    {
        case "MergeSort":
            console.log("Merge Sort started...");
            mergeSort(e, boxes);
            break;
        case "InsertionSort":
            console.log("Insertion Sort started...");
            insertionSort(e, boxes);
            break;
        case "BubbeSort":
            console.log("Bubble Sort started...");
            bubbleSort(e, boxes);
            break;
        case "QuickSort":
            console.log("Quick Sort started...");
            quicksort(e, boxes);
            break;
    }
}

// ============================================================

async function bubbleSort(e, boxes)
{
    for (var i = boxes.length-1; i>=0; i--)
    {
      for(var j = 1; j<=i; j++)
      {
        if(boxes[j-1].value >boxes[j].value)
        {
            audio.playbackRate = clamp(boxes[j].value/600, 0.25, 4.0);
            audio.play();

            var temp = [
                boxes[j-1].value,
                boxes[j-1].style.height,
                boxes[j-1].style.backgroundColor,
            ]

            boxes[j-1].style.backgroundColor = "#FFFF99";
            // await sleep(0);

            boxes[j-1].value = boxes[j].value;
            boxes[j-1].style.height = boxes[j].style.height;
            boxes[j-1].style.backgroundColor = boxes[j].style.backgroundColor;

            boxes[j].style.backgroundColor = "#FF3C3C";
            await sleep(0);

            boxes[j].value = temp[0];
            boxes[j].style.height = temp[1];
            boxes[j].style.backgroundColor = temp[2];
         }
      }
    }
    e.preventDefault();
}

// ============================================================

async function insertionSort(e, boxes)
{
    let n = boxes.length;
        for (let i = 1; i < n; i++)
        {
            // Choosing the first element in our unsorted subarray
            var current = [
                boxes[i].value,
                boxes[i].style.height,
                boxes[i].style.backgroundColor,
            ]
            // The last element of our sorted subarray
            let j = i-1; 
            while ((j > -1) && (current[0] < boxes[j].value))
            {
                boxes[j+1].value = boxes[j].value;
                boxes[j+1].style.height = boxes[j].style.height;
                boxes[j+1].style.backgroundColor = boxes[j].style.backgroundColor;
                // boxes[j+1] = boxes[j];

                boxes[j+1].style.backgroundColor = "#FFFF99";
                await sleep(0);
                
                var old_color = "rgba(42, 170, 138, " + (boxes[j+1].value/600).toString() + ")";
                playSound(boxes, j+1, old_color);
                // await sleep(0);

                j--;
            }
            boxes[j+1].value = current[0];
            boxes[j+1].style.height = current[1];
            boxes[j+1].style.backgroundColor = current[2];
            // boxes[j+1] = current;

            boxes[j+1].style.backgroundColor = "#FF3C3C";
            await sleep(0);
            var old_color = "rgba(42, 170, 138, " + (boxes[j+1].value/600).toString() + ")";
            playSound(boxes, j+1, old_color);
            // await sleep(0);

        }
    e.preventDefault();
}

// ============================================================

function partition(e, boxes, start, end) {

    // const pivot = boxes[end];
    const pivot = [
        boxes[end].value,
        boxes[end].style.height,
        boxes[end].style.backgroundColor,
    ]

    let i = start;
    for (let j = start; j < end; j += 1) {
        if (boxes[j].value <= pivot[0]) {


            // [boxes[j], boxes[i]] = [boxes[i], boxes[j]];
            var temp = [
                boxes[j].value,
                boxes[j].style.height,
                boxes[j].style.backgroundColor,
            ]

            boxes[j].value = boxes[i].value;
            boxes[j].style.height = boxes[i].style.height;
            boxes[j].style.backgroundColor = boxes[i].style.backgroundColor;

            boxes[i].value = temp[0];
            boxes[i].style.height = temp[1];
            boxes[i].style.backgroundColor = temp[2];

            i++;
        }
    }
    // [boxes[i], boxes[end]] = [boxes[end], boxes[i]];
    var temp2 = [
        boxes[i].value,
        boxes[i].style.height,
        boxes[i].style.backgroundColor,
    ]

    boxes[i].value = boxes[end].value;
    boxes[i].style.height = boxes[end].style.height;
    boxes[i].style.backgroundColor = boxes[end].style.backgroundColor;

    boxes[end].value = temp2[0];
    boxes[end].style.height = temp2[1];
    boxes[end].style.backgroundColor = temp2[2];

    e.preventDefault();
    return i;
}

async function quicksort(e, boxes, start = 0, end = undefined) {
    if (end === undefined) {
        end = boxes.length - 1;
    }

    if (start < end) {
        const p = partition(e, boxes, start, end);

        quicksort(e, boxes, start, p - 1);

        boxes[start].style.backgroundColor = "#FFFF99";
        await sleep(50);

        quicksort(e, boxes, p + 1, end);

        boxes[start].style.backgroundColor = "#FF3C3C";
        await sleep(50);

        var old_color = "rgba(42, 170, 138, " + (boxes[start].value/600).toString() + ")";
        playSound(boxes, start, old_color);
        await sleep(50);
    }
    e.preventDefault();
    return boxes;
}

// ============================================================

 async function mergeSort(e, boxes)
{
    if (boxes == null)
    {
        return;
    }

    if (boxes.length > 1) {
        var mid = parseInt(boxes.length / 2);

        // Split left part
        var left = Array(mid);
        for (i = 0; i < left.length; i++)
        {
            var li = document.createElement("li");
            li.setAttribute("class", "box");
            li.setAttribute("value", 0);

            left[i] = li;
        }

        for (i = 0; i < mid; i++)
        {
            // left[i] = array[i];
            left[i].value = boxes[i].value;
        }

        // Split right part
        var right = Array(boxes.length - mid);
        for (i = 0; i < right.length; i++)
        {
            var li = document.createElement("li");
            li.setAttribute("class", "box");
            li.setAttribute("value", 0);

            right[i] = li;
        }

        for (i = mid; i < boxes.length; i++)
        {
            // right[i - mid] = array[i];
            right[i - mid].value = boxes[i].value;
        }

        mergeSort(e, left);
        mergeSort(e, right);

        var i = 0;
        var j = 0;
        var k = 0;

        // Merge left and right arrays
        while (i < left.length && j < right.length)
        {
            boxes[k].style.backgroundColor = "#FF3C3C";
            await sleep(1);
    
            var old_color = "rgba(42, 170, 138, " + (boxes[k].value/600).toString() + ")";
            playSound(boxes, k, old_color);
            await sleep(1);

            if (left[i].value < right[j].value)
            {
                // array[k] = left[i];
                boxes[k].value = left[i].value;
                boxes[k].style.height = left[i].value.toString() + "px";
                boxes[k].style.backgroundColor = "rgba(42, 170, 138, " + (left[i].value/600).toString() + ")";

                i++;
            }
            else
            {
                // array[k] = right[j];
                boxes[k].value = right[j].value;
                boxes[k].style.height = right[j].value.toString() + "px";
                boxes[k].style.backgroundColor = "rgba(42, 170, 138, " + (right[j].value/600).toString() + ")";
            
                j++;
            }
            k++;
        }

        // Collect remaining elements
        while (i < left.length)
        {
            // array[k] = left[i];
            boxes[k].value = left[i].value;
            boxes[k].style.height = left[i].value.toString() + "px";
            boxes[k].style.backgroundColor = "rgba(42, 170, 138, " + (left[i].value/600).toString() + ")";

            i++;
            k++;
        }

        while (j < right.length)
        {
            // array[k] = right[j];
            boxes[k].value = right[j].value;
            boxes[k].style.height = right[j].value.toString() + "px";
            boxes[k].style.backgroundColor = "rgba(42, 170, 138, " + (right[j].value/600).toString() + ")";

            j++;
            k++;
        }
    }
    e.preventDefault();
}

// ============================================================

function playSound(boxes,index,color)
{
    audio.playbackRate = clamp(boxes[index].value/600, 0.25, 4.0);
    audio.play();

    boxes[index].style.backgroundColor = color;
}

function randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
  }


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }