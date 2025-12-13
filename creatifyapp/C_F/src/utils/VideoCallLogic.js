export const createOffer = async (peer) => {
  try {
    const offer  = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  }
  catch (err) {
    alert('Something Went wrong!!!')
  }
};

export const createAnswer = async (peer, callersOffer) => {
  try {
    await peer.setRemoteDescription(callersOffer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  }
  catch (err) {
    alert('Something Went wrong!!!')
  }
};

export const sendStream = async (stream, peer) => {
  try {
    const tracks = stream.getTracks();
    console.log(`📤 Sending ${tracks.length} tracks to peer`);
    for (const track of tracks) {
      peer.addTrack(track, stream);
      console.log(`Added ${track.kind} track to peer connection`);
    }
    console.log('✅ All tracks added to peer connection');
  }
  catch (err) {
    console.error('❌ Error sending stream:', err);
    alert('Something Went wrxccccccccccccong!!!')
  }
}