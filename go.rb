require 'sinatra'
require 'sinatra-websocket'
require 'json'
require 'haml'

set :server, 'thin'

$users    = {}
$logfile  = "chat.log"
$log      = open($logfile, "a")
$log.sync = true

def lastlog(n=20)
  open($logfile) do |f|
    f.reverse_each.take(100).reverse
  end
end

def log(msg_hash)
  p msg_hash
  $log.puts(msg_hash.to_json)
end

def broadcast(msg_hash)
  $sockets.each{|s| s.send(msg_hash.to_json) }
end

# def timestamp(at=nil)
#   time = at ? Time.parse(at) : Time.now
#   time.strftime("%H:%M:%S")
# end

get '/' do
  if !request.websocket?
    haml :index
  else
    request.websocket do |ws|
      ws.onopen do
        warn("websocket #{ws} opened")

        # Send scrollback
        lastlog.each do |json|
          ws.send(json)
        end

        $sockets[ws] = ""
      end

      # Receive message from the client
      ws.onmessage do |json|
        msg_hash = JSON.parse(json)
        msg_hash["time"] = Time.now.to_s
        log(msg_hash)
        EM.next_tick { broadcast(msg_hash) } # broadcast to everyone
      end

      ws.onclose do
        warn("websocket #{ws} closed")
        $sockets.delete(ws)
      end
    end
  end
end
