const server = require("http").Server();
const port = process.env.PORT || 10001;

var io = require("socket.io")(server);

var users = {};

io.on("connection", function(socket){
    io.emit("joined");
    console.log("user connected");
    
    socket.on("disconnect", function(){
        
        var index = users[this.myRoom].indexOf(socket.id);
        users[this.myRoom].splice(index, 1);
        io.in(this.myRoom).emit("DiceDcd", users[this.myRoom]);
    })
    
    socket.on("Dicejoinroom", function(data){
        console.log("joining room", data.room, data.name);
        
        socket.join(data.room);
        socket.myRoom = data.room;
        
        if(!users[data.room]){
            users[data.room] = [];
        };
        
        users[data.room].push(data.name);
        
        io.in(data.room).emit("Diceuserjoined", users[data.room]);
        
    });
    
    socket.on("rolled", function(data){
        console.log(data);
        socket.to(this.myRoom).emit("DiceRolled", data);
    });
});

server.listen(port, (err)=>{
    if (err) {
        console.log("Error " + err);
        return false;
    }
    
    console.log("Server is running, port is opened");
})