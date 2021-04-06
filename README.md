# Project Introduction

- Use D3, plotly.js to build dashboard, which include bar chart, bubble chart, and gauge chart.
- Data comes from a static json file.
- Data can be choose by select diferent ID.
- All charts and info will be re-rendered based on the data selected.
- Webpage preview

<image src="images/page.png" alt="page.png" width="1000">

# Gauge chart

## Use pie chart to build the meter

- half pie chart divided by 9 section. each seclion is labeled by number.
- Set the other half pie color as white, and label as " " (a string of space)
  - Make sure not to label as empty string. In this case, the default label "9" would be on the chart.
  - label position is "inside"

## Use path to draw a triangle for the needle.

### the needle chart is in layout{shape:[]}, instead of data[trace]

    ```js
    var layout = {
        xaxis: {
            range: [0, 9],
            zeroline: false,
        },
        yaxis: {
            range: [0, 11],
            showgrid: false,
        },
        width: 500,
        height: 500,
        shapes: [
            {
            type: 'path',
            // path: 'M 1 1 L 1 3 L 4 1 Z',
            path: pathTriangle(0.5, 0.5, 0.25, (Math.PI * 4 * 20) / 180),
            fillcolor: 'red',
            line: {
                color: 'red',
            },
            },
        ],
    };
    ```

### Calculate the (x,y) of triangle point

- A,B,C is three points of triangle, the line BC is base, BC = 2w
- D is the middle point of base. BD = CD = w. The coordinates of D is (xD, yD)
- (xA, yA) is point A, (xB, yB) is point B, (xC, yC) is point C
- h: the hight of triangle, the length of AD.
- rotation: The degree of needle

- To calculate coordinates of A,B,C based on (xD, yD), h and rotation
- Assume the angle <BAC = 5 degree

```js
const pi = Math.PI;
const degreeBAC = pi / 36;
let degreeADF = -(rotation <= pi / 2 ? rotation : pi - rotation);
let degreeCDE = pi / 2 - degreeADF;
let lengthCD = h * Math.tan(degreeBAC / 2);
let lengthCE = lengthCD * Math.sin(degreeCDE);
let lengthDE = lengthCD * Math.cos(degreeCDE);
let lengthAF = h * Math.sin(degreeADF);
let lengthDF = h * Math.cos(degreeADF);
//

let xA = rotation <= 90 ? xD - lengthDF : xD + lengthDF;
let yA = yD - lengthAF;
let xB = xD - lengthDE;
let yB = rotation <= 90 ? yD + lengthCE : yD - lengthCE;
let xC = xD + lengthDE;
let yC = rotation <= 90 ? yD - lengthCE : yD + lengthCE;

let path = `M ${xB} ${yB} L${xA} ${yA} L${xC} ${yC} Z`;
```

<image src="images/triangle.png" alt="page.png" width="1000">
