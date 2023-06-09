class Snowflake {
    constructor() {
        this.epoch = 1288834974657n;
        this.workerIdBits = 5n;
        this.datacenterIdBits = 5n;
        this.sequenceBits = 12n;

        this.maxWorkerId = (1n << this.workerIdBits) - 1n;
        this.maxDatacenterId = (1n << this.datacenterIdBits) - 1n;

        this.workerIdShift = this.sequenceBits;
        this.datacenterIdShift = this.sequenceBits + this.workerIdBits;
        this.timestampLeftShift = this.sequenceBits + this.workerIdBits + this.datacenterIdBits;
        this.sequenceMask = (1n << this.sequenceBits) - 1n;

        this.lastTimestamp = -1n;
        this.sequence = 0n;

        this.workerId = 0n;
        this.datacenterId = 0n;
    }

    nextId() {
        let timestamp = BigInt(Date.now());

        if (timestamp < this.lastTimestamp) {
            throw new Error('Clock moved backwards!');
        }

        if (timestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + 1n) & this.sequenceMask;

            if (this.sequence === 0n) {
                timestamp = this.waitNextMillis();
            }
        } else {
            this.sequence = 0n;
        }

        this.lastTimestamp = timestamp;

        const id =
            ((timestamp - this.epoch) << this.timestampLeftShift) |
            (this.datacenterId << this.datacenterIdShift) |
            (this.workerId << this.workerIdShift) |
            this.sequence;

        return id;
    }

    waitNextMillis() {
        let timestamp = BigInt(Date.now());
        while (timestamp <= this.lastTimestamp) {
            timestamp = BigInt(Date.now());
        }
        return timestamp;
    }
}
module.exports = Snowflake;