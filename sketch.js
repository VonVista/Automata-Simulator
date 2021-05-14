
let clickMode = "none"
let inp
let tempTransition
let stringValue = ""
let keyPress
let editingMode = false

let test = 0

// canvasWidth = 400
// canvasHeight = 400
canvasWidth = 400
canvasHeight = 400

//COLORS
let YELLOW = [255, 242, 0]
let WHITE = [255,255,255]

class GraphNode {
  constructor(name, x, y){
    this.name = name
    this.x = x
    this.y = y
    this.size = 50
    this.coNodes = []
    this.isInitial = false
    this.isFinal = false
    this.selected = false
    this.traversed = false     //FOR TRAVERSAL
    this.color = [255,255,255]
  }
  draw(){
    fill(28, 42, 53);
    stroke(this.color[0], this.color[1], this.color[2])

    if(this.color[0] < 255){
      this.color[0] += 3
    }
    if(this.color[1] < 255){
      this.color[1] += 3
    }
    if(this.color[2] < 255){
      this.color[2] += 3
    }


    ellipse(this.x, this.y, this.size, this.size)

    if(this.isFinal){
      ellipse(this.x, this.y, this.size - 10, this.size - 10)
    }
    fill(255,255,255);
    if(this.isInitial){
      triangle(this.x - 50, this.y + 25, this.x - 50, this.y - 25, this.x - 25, this.y)
    }
    noStroke()
    fill(255, 255, 255);
    textSize(12)
    text(this.name, this.x, this.y)
  }
  clicked(){
    if(!editingMode){
      if(mouseX > this.x - this.size/2 && mouseX < this.x + this.size/2 && mouseY > this.y - this.size/2 && mouseY < this.y + this.size/2){
        console.log("clicked")
        return this
      }
    }
  }
}

class Edge {
  constructor(start, end, edgeType){
    this.start = start
    this.end = end
    this.editingTransition = true
    this.transition = []
    this.edgeType = edgeType
    this.traversed = false     //FOR TRAVERSAL
    this.color = [255,255,255]
  }
  draw(){

    if(this.end.name == undefined){
      for(let [index, edge] of edges.entries()){
        if(edge == this && this.start.coNodes != undefined){
          for(let [index, node] of this.start.coNodes.entries()){
            if(node.target = this.end){
              this.start.coNodes.splice(index, 1)
            }
            console.log(this.start.coNodes)
          }
          
          edges.splice(index, 1)
        }
      }
      return
    }
    if(this.start.name == undefined){
      return
    }

    var center = 25

    var midX = (this.start.x + this.end.x)/2
    var midY = (this.start.y + this.end.y)/2

    let curveDistance = 25
    let distance = sqrt(pow(this.start.y - this.end.y,2) + pow(this.end.x - this.start.x,2))
    distance = curveDistance/distance
    
    //Control line shape
    stroke(this.color[0], this.color[1], this.color[2])

    if(this.color[0] < 255){
      this.color[0] += 3
    }
    if(this.color[1] < 255){
      this.color[1] += 3
    }
    if(this.color[2] < 255){
      this.color[2] += 3
    }

    if(this.edgeType == "straight"){
      line(this.start.x, this.start.y, this.end.x, this.end.y)
    }
    else if(this.edgeType == "curve"){
      
      noFill()
      beginShape()
      curveVertex(this.start.x,this.start.y)
      curveVertex(this.start.x,this.start.y)
      curveVertex(midX + distance * (this.start.y-this.end.y), midY + distance * (this.end.x-this.start.x))
      curveVertex(this.end.x,this.end.y)
      curveVertex(this.end.x,this.end.y)
      endShape()
      
    }
    else if(this.edgeType == "loop"){

      let loopOffset = 20
      curveDistance = 60

      let distance = sqrt(pow(this.start.y - this.end.y,2) + pow((this.end.x - loopOffset) - (this.start.x + loopOffset),2))
      distance = curveDistance/distance

      noFill()
      beginShape()
      curveVertex(this.start.x + loopOffset,this.start.y)
      curveVertex(this.start.x + loopOffset,this.start.y)
      curveVertex(midX + distance * (this.start.y-this.end.y), midY + distance * ((this.end.x - loopOffset) - (this.start.x + loopOffset)))
      curveVertex(this.end.x - loopOffset,this.end.y)
      curveVertex(this.end.x - loopOffset,this.end.y)
      endShape()
    }

    fill(this.color[0], this.color[1], this.color[2])
    noStroke()
    
    //Control arrow point
    var offset = 8
    push() //start new drawing state
    var angle = atan2(this.start.y - this.end.y, this.start.x - this.end.x); //gets the angle of the line

    if(this.edgeType == "straight"){
      translate(midX, midY); //translates to the destination vertex
    }
    else if(this.edgeType == "curve"){
      translate(midX + distance * (this.start.y-this.end.y), midY + distance * (this.end.x-this.start.x))
    }
    else if(this.edgeType == "loop"){
      angle = -90
      translate(this.start.x + 14, this.start.y - 25)
    }

    rotate(angle-HALF_PI); //rotates the arrow point
    triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2); //draws the arrow point as a triangle
    pop();

    textSize(12)

    //control transition labels
    let labelString = ""
    for(let i = 0; i < this.transition.length; i++) {
      labelString += this.transition[i] + ", "
    }

    if(this.edgeType == "straight"){
      text(labelString.substring(0,labelString.length - 2), (this.start.x + this.end.x)/2, (this.start.y + this.end.y)/2 - 20)

    }
    else if(this.edgeType == "curve"){
      text(labelString.substring(0,labelString.length - 2), midX + distance * (this.start.y-this.end.y), midY + distance * (this.end.x-this.start.x)- 20)
    }
    else if(this.edgeType == "loop"){
      text(labelString.substring(0,labelString.length - 2), this.start.x, this.start.y - curveDistance - 10)
    }

    if(this.editingTransition){
      this.editTransition()
    }


    
  }

  clicked(){
    let clickArea = 15

    var midX = (this.start.x + this.end.x)/2
    var midY = (this.start.y + this.end.y)/2

    let curveDistance = 25
    let distance = sqrt(pow(this.start.y - this.end.y,2) + pow(this.end.x - this.start.x,2))
    distance = curveDistance/distance

    if(this.edgeType == "straight" && dist((this.start.x + this.end.x)/2, (this.start.y + this.end.y)/2, mouseX, mouseY) < clickArea){
      console.log("EDGE CLICK")
      return this
    }
    
    else if(this.edgeType == "curve" && dist(midX + distance * (this.start.y-this.end.y), midY + distance * (this.end.x-this.start.x), mouseX, mouseY) < clickArea){
      console.log("EDGE CLICK")
      return this
    }
    if(this.edgeType == "loop" && dist(this.start.x, this.start.y - 60, mouseX, mouseY) < clickArea){
      console.log("EDGE CLICK")
      return this
    }
  }

  editTransition(){
    
    inp.position((this.start.x + this.end.x)/2, (this.start.y + this.end.y)/2);
    editingMode = true

    inp.input(function myInputEvent() {
      tempTransition = this.value()
      console.log(tempTransition)
    })
      
    if(keyPress == "Enter") {
      editingMode = false
      console.log(test)
      clickMode = "addEdge"
      let endNode = this.end

      let edgeToUse = this;

      for(let node of this.start.coNodes){
        if(node.edge.end == this.end){
          console.log("Connection already exists")
          node.edge.transition.push(tempTransition)
          //this.start.coNodes[this.start.coNodes.length - 1].edge = node.edge;
          edgeToUse = node.edge
          //this.start.coNodes.pop()
          edges.pop()
          console.log(edges)
        }
      }

      this.start.coNodes.push({transition: tempTransition, target: this.end, edge: edgeToUse})
      this.transition.push(tempTransition)
      inp.position(-1000, -1000)
      this.editingTransition = false
      console.log(this.start.coNodes)
      console.log(this.transition)
            
      
    }
  }
  
}

function keyPressed() {
  if (keyCode === ENTER) {
    console.log("Enter")
    keyPress = "Enter"
  }
}

function keyReleased() {
  keyPress = null
}

function handleAddNode() {
  clickMode = "addNode"
}


function handleRemoveNode() {
  clickMode = "removeNode"
}

function clickTest() {
  alert("I am called")
}

function handleAddEdge() {
  clickMode = "addEdge"
}


function handleMouse() {
  clickMode = "none"
}

function handleSetInitialState() {
  clickMode = "setInitialState"
}

function handleSetFinalState() {
  clickMode = "setFinalState"
}

function handleRemoveNodeState() {
  clickMode = "removeNodeState"
}

function handleStringInput() { 
  //stringValue = this.value()
  //document.getElementById("myText").value = "Johnny Bravo";
  stringValue = document.getElementById("testString").value
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testString() {
  let animationTime = 400

  let curNode = null;
  for(let node of nodes){
    if(node.isInitial){
      curNode = node
      break
    }
  }
  if(curNode != null){
    curNode.color = [255, 242, 0]
    await sleep(animationTime)

    for(let s of stringValue){
      charFound = false
      console.log(edges.length)
      for(let node of curNode.coNodes){
        if(node.transition === s){
          
          //curNode.color = [255,255,255] //OLD NODE RESET COLOR
          node.edge.color = [255, 242, 0] //TRAVERSED EDGE

          await sleep(animationTime)

          //node.edge.color = [255,255,255] //TRAVERSED EDGE RESET COLOR

          console.log(node.target)
          curNode = node.target

          curNode.color = [255, 242, 0] //NEW NODE

          await sleep(animationTime)
          
          charFound = true
          break
        }
      }
      if(!charFound){
        console.log("Reject")
        alert("String is Rejected")
        return
      }
    }
    if(curNode.isFinal){
      console.log("Accept")
      alert("String is accepted")
    }
    else {
      console.log("Reject")
      alert("String is Rejected")
    }

    //curNode.color = [255,255,255] //RESET COLOR NODE
  }
}


function applyInputStyle() {
  stringInput.style("border", "none")
  stringInput.style("padding", "12px")
  stringInput.style("text-align", "center")
  stringInput.style("text-decoration", "none")
  stringInput.style("display", "inline-block")
  stringInput.style("font-size", "12px")
  stringInput.style("font-family", "'Open Sans', sans-serif")
  stringInput.style("font-weight","normal")
  stringInput.style("margin","1px")
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("sketchHolder");
  console.log(cnv)
  
  inp = createInput("")
  inp.parent("sketchHolder")
  inp.size(100);
  inp.position(-200,-200)
  
  textAlign(CENTER, CENTER)
  rectMode(CENTER)
}

let nodes = []
let edges = []
let startx = 0, starty = 0, endx = 0, endy = 0
let startnode = undefined, endnode = undefined
let selectedNode, selectedEdge

function draw() {
  noStroke()
  background(28, 42, 53);

  textAlign(CENTER, CENTER)
  
  //tempLine
  stroke(255)
  line(startx, starty, endx, endy)
  
  //nodes render
  
  for(let edge of edges){
    edge.draw()
  }

  for(let node of nodes){
    node.draw()
  }

  testFunction()
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve,ms));
}

async function testFunction() {
  await sleep(1000)
  //console.log("ASYNC")
}

async function mousePressed(){

  if(mouseButton == LEFT){
    if(clickMode == "addNode"){
      console.log(nodes)
      var newNode = new GraphNode("q" + str(nodes.length), mouseX, mouseY)
      nodes.push(newNode)
      
    }

    else if(clickMode == "addEdge"){
      startx = mouseX
      starty = mouseY
      endx = mouseX
      endy = mouseY
      for(let node of nodes){
        startnode = node.clicked()
        if(startnode != undefined){
          break
        }
      }
    }
    else if(clickMode == "none"){
      for(let node of nodes){
        selectedNode = node.clicked()
        if(selectedNode != undefined){
          selectedNode.x = mouseX
          selectedNode.y = mouseY
          selectedNode.color = [255, 242, 0];
          break
        }
      }
    }
    else if(clickMode == "removeNode"){
      for(let [index, node] of nodes.entries()){
        selectedNode = node.clicked()
        if(selectedNode != undefined){ //selected node is object to delete
          Object.keys(selectedNode).forEach(function(key) { delete selectedNode[key]; });
          console.log(selectedNode)
          nodes.splice(index, 1)

          break
        }
      }

      for(let [index, edge] of edges.entries()){
        selectedEdge = edge.clicked()
        if(selectedEdge != undefined){ //selected node is object to delete


          for(let edge of edges){

            if(edge.end == selectedEdge.start && edge.start == selectedEdge.end){
              edge.edgeType = "straight"
              break
            }
          }

          for(let [index, node] of selectedEdge.start.coNodes.entries()){
            if(node.edge = selectedEdge){

              selectedEdge.start.coNodes.splice(index, 1)
              console.log(selectedEdge.start.coNodes)
            }
          }
          console.log(selectedEdge.start.coNodes)
          edges.splice(index, 1)

          break
        }
      }


    }
    else if(clickMode == "setInitialState"){
      for(let node of nodes){
        selectedNode = node.clicked()
        if(selectedNode != undefined){

          for(let node of nodes){
            node.isInitial = false
          }

          selectedNode.isInitial = true
          break
        }
      }
    }
    else if(clickMode == "setFinalState"){
      for(let node of nodes){
        selectedNode = node.clicked()
        if(selectedNode != undefined){
          selectedNode.isFinal = true
          break
        }
      }
    }
    else if(clickMode == "removeNodeState"){
      for(let node of nodes){
        selectedNode = node.clicked()
        if(selectedNode != undefined){
          selectedNode.isFinal = false
          selectedNode.isInitial = false
          break
        }
      }
    }
    
  }

}

function mouseDragged(){
  if(mouseButton == LEFT){
    if(clickMode == "addEdge"){
      endx = mouseX
      endy = mouseY
    }
    else if (clickMode == "none"){
      if(selectedNode != undefined){
        selectedNode.x = mouseX
        selectedNode.y = mouseY
      }
      
    }
  }
}

function mouseReleased(){
  //console.log(startnode)
  if(selectedNode != undefined){
    selectedNode.color = [255, 255, 255];
  }

  if(clickMode == "addEdge"){
    for(let node of nodes){
      endnode = node.clicked()
      if(endnode != undefined){
        break
      }
    }
    if(startnode != undefined && endnode != undefined){
      let lineType = "straight"

      for(let node of endnode.coNodes){
        console.log(node)
        if(startnode != endnode && node.edge.start == endnode && node.edge.end == startnode){
          console.log("IT WORKS")
          lineType = "curve"
          node.edge.edgeType = "curve"
          break
        }
      }

      if(startnode == endnode){
        lineType = "loop"
      }
      var newEdge = new Edge(startnode, endnode, lineType)
      edges.push(newEdge)
      console.log(startnode)
      console.log(edges.length)
    }

    startx = 0, starty = 0, endx = 0, endy = 0
    
  }
}

