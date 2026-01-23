// services/queue_service.js

class AsyncQueue {
  constructor(concurrency = 1) {
    this.queue = [];
    this.running = 0;
    this.concurrency = concurrency;
  }

  enqueue(task) {
    this.queue.push(task);
    this.process();
  }

  async process() {
    if (this.running >= this.concurrency || this.queue.length === 0) return;

    const task = this.queue.shift();
    this.running++;

    try {
      await task();
    } catch (err) {
      console.error("❌ Queue Task Error:", err);
    } finally {
      this.running--;
      this.process();
    }
  }
}

module.exports = new AsyncQueue(1); // send mails ONE BY ONE
