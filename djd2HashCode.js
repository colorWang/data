var djbHashCode = function(key){
  var hash = 5381
  for(var i = 0; i<key.length; i++){
    hash = hash + key[i].charCodeAt()
  }
  return hash % 1013
}
