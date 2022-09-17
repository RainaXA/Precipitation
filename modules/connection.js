client.on('reconnecting', function() {
    log("Precipitation is currently disconnected and attempting to reconnect.", logging.warning, "CONNECTION");
});

client.on('disconnect', function() {
    log("\nPrecipitation has disconnected and will not reconnect.", logging.error, "CONNECTION");
    log("You'll need to restart Precipitation to reconnect.", logging.output, "CONNECTION")
});

client.on('resume', function(replayed) {
  log("Precipitation has reconnected - " + replayed + " events were replayed.", logging.success, "CONNECTION")
})
