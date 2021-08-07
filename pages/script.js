const generateGrid = () =>
{
    var grid = document.getElementById("grid");

    for(var i=0; i<100; i++)
    {
        var cell = document.createElement("div");
        cell.setAttribute("class", "cell noselect");
        cell.setAttribute("id", `${i}`);
        cell.setAttribute("onmousedown", `setObstactle(${i});`);

        var cell_value = document.createElement("p");
        cell_value.setAttribute("class", "cell_value");
        cell_value.innerHTML = 0;
        cell.appendChild(cell_value);

        // cell.innerHTML = 0;
        grid.appendChild(cell);
    }
}

const setObstactle = (index) =>
{
    // console.log(`Clicked cell ${index}!`);
    let colors = [
        "rgb(112, 112, 112)",
        "rgb(144, 238, 144)",
        "rgb(255, 127, 127)",
        "rgb(238, 238, 238)"
    ];

    let borders = [
        "3px solid rgb(255, 127, 127)",
        "3px solid rgb(175, 175, 175)",
        "3px solid rgb(175, 175, 175)",
        "1px dashed rgb(175, 175, 175)"
    ];

    cell = document.getElementById(index);
    val = cell.getElementsByClassName("cell_value")[0];

    cell.style.background = colors[val.innerHTML];
    cell.style.border = borders[val.innerHTML]

    // if there is another start, move onto next index.
    if( exist2Start() >= 2 )
    {
        val.innerHTML = 2;
        cell.style.background = colors[val.innerHTML];
        cell.style.border = borders[val.innerHTML]
    }

    // if there is another end, move onto next inde
    if( exist2End() >= 2)
    {
        val.innerHTML = 3;
        cell.style.background = colors[val.innerHTML];
        cell.style.border = borders[val.innerHTML]
    }

    // get next index
    val.innerHTML = (parseInt(val.innerHTML) + 1) % colors.length;
}

const exist2Start = () =>
{
    var cells = document.getElementsByClassName("cell");
    start_count = 0;
    for (var i=0; i<100; i++)
    {
        if (cells[i].style.background == "rgb(144, 238, 144)")
        {
            start_count += 1;
        }
    }
    return start_count;
}

const exist2End = () =>
{
    var cells = document.getElementsByClassName("cell");
    end_count = 0;
    for (var i=0; i<100; i++)
    {
        if (cells[i].style.background == "rgb(255, 127, 127)")
        {
            end_count += 1;
        }
    }
    return end_count;
}

grid = [];
var buttonGrid = document.getElementById("get_grid");
buttonGrid.addEventListener("click", convertToGrid);
function convertToGrid()
{
    var array = [];
    for (var i=0; i<10; i++) { array[i] = [0,0,0,0,0,0,0,0,0,0]; }

    dic = {
        0: "0",
        1: '#',
        2: 'S',
        3: 'E'
    }

    var cells = document.getElementsByClassName("cell");

    var index = 0;
    var level = 0;

    for (var i=0; i<100; i++)
    {
        if (index == 10)
        {
            level = level + 1;
            index = 0;
        }

        var val = cells[i].getElementsByClassName("cell_value")[0];
        array[level][index] = dic[parseInt(val.innerHTML)];

        index = index + 1;
    }
    grid = [... array];
}

var buttonGrid = document.getElementById("do_path");
buttonGrid.addEventListener("click", doPath);
async function doPath()
{
    S_E = getStartEnd();
    if ( (S_E[0][0] == -1) || (S_E[1][0] == -1) )
    {
        alert("Invalid grid given. Need at least one start and one end");
        return -1;
    }
    
    var start = S_E[0];
    var end = S_E[1];


    let queue = [];
    queue.push( [start[0], start[1], [start] ] );

    let v = new Set();
    v.add(start[0].toString().concat(start[1].toString()));

    var cells = document.getElementsByClassName("cell");
    var vals = document.getElementsByClassName("cell_value");

    while (queue.length != 0)
    {
        var pos = queue.shift();

        var idx = grid_to_cell(pos[0],pos[1]);
        var cell = cells[idx];
        var val = vals[idx];

        // marking visisted logic.
        val.innerHTML = 'v';
        if ( (pos[0] != start[0]) || (pos[1] != start[1]) )
        {
            cell.style.background = "lightblue";
        }
        await sleep(50);
   
        var poss_moves =
        [
            [pos[0], pos[1]+1, dist(pos[0], pos[1]+1, end[0], end[1])],
            [pos[0]+1, pos[1], dist(pos[0]+1, pos[1], end[0], end[1])],
            [pos[0], pos[1]-1, dist(pos[0], pos[1]-1, end[0], end[1])],
            [pos[0]-1, pos[1], dist(pos[0]-1, pos[1], end[0], end[1])],
        ];
        poss_moves.sort(sortFunction);

        for (var i=0; i<poss_moves.length; i++)
        {
            var move = poss_moves[i];
            if ( is_tile(move[0], move[1]) )
            {
                var idx = grid_to_cell(move[0],move[1]);
                var cell = cells[idx];
                var val = vals[idx];

                if ( (move[0] == end[0]) && (move[1] == end[1]) )
                {
                    console.log("Path found!");
                    val.innerHTML = 'v';
                    
                    var path = [...pos[2], [move[0],move[1]] ];
                    createLine(path);
                    return 1;
                }

                var key = move[0].toString().concat(move[1].toString());
                if ( !v.has(key) )
                {
                	  v.add(key);

                    var next_move = [move[0], move[1], [...pos[2], [move[0],move[1]] ] ];
                    queue.push( next_move );
                }
            }
        }
    }
}

// a.sort(sortFunction);
function sortFunction(a, b) {
    if (a[2] === b[2]) {
        return 0;
    }
    else {
        return (a[2] < b[2]) ? -1 : 1;
    }
}

function diff (num1, num2) {
    if (num1 > num2) {
      return (num1 - num2);
    } else {
      return (num2 - num1);
    }
  };

function dist (x1, y1, x2, y2) {
    var deltaX = diff(x1, x2);
    var deltaY = diff(y1, y2);
    var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    return (dist);
  };


var buttonReset = document.getElementById("do_reset");
buttonReset.addEventListener("click", resetGrid);
function resetGrid()
{
    var array = [];
    for (var i=0; i<10; i++) { array[i] = [0,0,0,0,0,0,0,0,0,0]; }

    grid = [...array];

    var cells = document.getElementsByClassName("cell");
    for (var i=0; i<100; i++)
    {
        cells[i].style.background = "rgb(238, 238, 238)";
        cells[i].style.border = "1px dashed rgb(175, 175, 175)";
        val = cells[i].getElementsByClassName("cell_value")[0];
        val.innerHTML = 0;
    }
}

async function createLine(path)
{
    var steps = 0;
    for (var i=0; i<path.length; i++)
    {
        var idx = grid_to_cell(path[i][0],path[i][1]);
        var cell = document.getElementById(idx);
        var val = cell.getElementsByClassName("cell_value")[0];
        val.innerHTML = steps;

        if(i == 0)
        {
            cell.style.background = "rgb(144, 238, 144)";
        }
        else if (i == path.length - 1)
        {
            cell.style.background = "rgb(255, 127, 127)";
        }
        else
        {
            cell.style.background = "yellow";
        }
        cell.style.border = "3px solid rgb(175, 175, 175)";
        steps += 1;
        await sleep(100);
    }
} 

function getStartEnd()
{
    var start = [-1,-1];
    var end = [-1,-1];

    for (var i=0; i<grid.length; i++)
    {
        for (var j=0; j<grid[0].length; j++)
        {
            if (grid[i][j] == 'S') { start = [i,j]; }
            if (grid[i][j] == 'E') { end = [i,j]; }
        }
    }
    return [start, end];
}

const grid_to_cell = (i, j) =>
{   var value = (10*i) + j;
    return value;
}

const is_tile = (i, j) =>
{
    if ( (i >= 0 && i < 10) && (j >= 0 && j < 10) )
    {
        if ( (grid[i][j] != '#') )
        {
            return true;
        }
    }
    return false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}