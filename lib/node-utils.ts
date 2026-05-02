import { Readable } from "stream";

export function webStreamToNodeStream(
  webStream: ReadableStream<Uint8Array>,
): Readable {
  const nodeStream = new Readable({
    read() {},
  });

  const reader = webStream.getReader();

  function pump() {
    reader
      .read()
      .then(({ done, value }) => {
        if (done) {
          nodeStream.push(null);
          return;
        }
        nodeStream.push(Buffer.from(value));
        pump();
      })
      .catch((err) => {
        nodeStream.emit("error", err);
      });
  }

  pump();
  return nodeStream;
}
