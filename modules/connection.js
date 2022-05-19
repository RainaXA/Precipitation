client.on('reconnecting', function() {
    log("Precipitation is currently disconnected and attempting to reconnect.", logging.warning, 1);
});

client.on('disconnect', function() {
    log("\nPrecipitation has disconnected and will not reconnect.", logging.error, 3);
    log("You'll need to restart Precipitation to reconnect.", logging.output, 2)
});

client.on('resume', function(replayed) {
  log("Precipitation has reconnected - " + replayed + " events were replayed.", logging.success, 1)
})
