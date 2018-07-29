var express = require('express');
var router = express.Router();
var write = require('fs-writefile-promise');
var exec = require('child-process-promise').exec;

router.get("/", function(req, res, next) {
        console.log(res.body);
    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ a: 1 }, null, 3));

});

function rating(table) {
    var upper = (table["happy cat"] + table["unhappy cat"]) / 2;
    var lower = (table["unhappy cat"] + table["ugly cat"]) / 2;
    
    return Math.max(upper - lower , 0);
}

router.post('/', function(req, res, next) {
    
//    console.log(req.body);
    console.log("recieved");
    
    write("public/1.jpg", atob(req.body.payload.image.imageBytes)).then(function() {   
        
        return exec("python3  /src/snapcat/tf/label_image.py --graph=/tmp/output_graph.pb --labels=/tmp/output_labels.txt  --input_layer=Placeholder --output_layer=final_result --image=/src/snapcat/express/public/1.jpg | grep  -oh");
        
    }).then((result) => {

        console.log("done", result.stdout, result.exitCode);
        res.setHeader('Content-Type', 'application/json');
        res.send(result);

    }).catch(function(err) {
        console.log(err);  
    });
    
});

module.exports = router;
