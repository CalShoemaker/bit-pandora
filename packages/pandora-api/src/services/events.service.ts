import { Injectable } from '@nestjs/common';
import { fromEvent } from "rxjs";
import { EventEmitter } from "events";

@Injectable()
export class EventsService {

    private readonly emitter: EventEmitter;

    constructor() {
        this.emitter = new EventEmitter();
    }
    
    subscribe() {
        return fromEvent(this.emitter, 'channel');
    }
    
    async emit(data) {
        this.emitter.emit('channel', { data });
    }

}
