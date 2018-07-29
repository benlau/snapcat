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
    
    write("public/1.jpg", req.body.payload.image.imageBytes).then(function() {   
        
        return exec("python3 label_image.py --graph=/tmp/output_graph.pb --labels=/tmp/output_labels.txt  --input_layer=Placeholder --output_layer=final_result --image=/src/sample/Fox-Spirit-Animal-7.jpg | grep  -oh");
        
    }).then((result) => {

        console.log("done", result.stdout, result.exitCode);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ a: 1 }, null, 3));

    }).catch(function(err) {
        console.log(err);  
    });
    
});

module.exports = router;
