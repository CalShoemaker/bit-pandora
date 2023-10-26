import { GameState } from ".";

const uri = "http://localhost:8081/api/";

const postOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
};

const getOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" }
};

const pandoraActions = {
    init(context:any, config:any) {
        // Ensure config data
        // config = (config.name && config.type || config.player && config.type) ? config : { name: "Player One", type:"QUICK" } ;

        const GameOptions = {
            ...postOptions,
            body: JSON.stringify(config)
        };

        return fetch(uri, GameOptions).then(response => response.json()).then(data=>{
            context.commit("Update", data);
            return data;
        });
    },
    setup(context:any, id:number){
        const GetGameOptions = {
            ...getOptions
        };
            
        return fetch(uri + id, GetGameOptions).then(res=>res.json()).then(data=>{        
            data.channel = new EventSource(uri + id + '/channel');
            context.commit("Update", data);
            return data;
        });
    },
    getGame(context:any, id:number){
        const GetGameOptions = {
            ...getOptions
        };
            
        return fetch(uri + id, GetGameOptions).then(res=>res.json()).then(data=>{        
            context.commit("Update", data);
            return data;
        });
    },
    join(context:any, config:any) {
        // Ensure config data
        // config = (config.name && config.type || config.player && config.type) ? config : { name: "Player One", type:"QUICK" } ;

        const GameOptions = {
            ...postOptions,
            body: JSON.stringify(config)
        };

        return fetch(uri + config.gid +"/join", GameOptions).then(response => response.json()).then(data=>{
            context.commit("Update", data);
            return data;
        });
    },
    Cast(context:any, config:any){
        const { player, id, n } = config;
        const CastGameOptions = {
            ...postOptions,
            body: JSON.stringify(config)
        };

        return fetch(uri + id +"/cast", CastGameOptions).then(res=>res.json()).then(data=>{
            context.commit("Update", data);
        });
    },
    Pick(context:any, config:any){
        const { player, id, solution } = config;
        const PickGameOptions = {
            ...postOptions,
            body: JSON.stringify(config)
        };

        return fetch(uri + id +"/pick", PickGameOptions).then(res=>res.json()).then(data=>{
            context.commit("Update", data);
        });
    },
    newPlayer(context:any, config: any){
        const safeName = config.name.substring(0, 15);
        config.name = safeName;

        const PlayerOptions = {
            ...postOptions,
            body: JSON.stringify(config)
        };
        return fetch(uri + 'player', PlayerOptions).then(res=>res.json());
    },
    getPlayer(context:any, id:number){
        const GetPlayerOptions = {
            ...getOptions
        };

        return fetch(uri + 'player/'+ id, GetPlayerOptions).then(res=>res.json());
    },
    chirp(context:any, raw:string){
        let _raw:GameState = JSON.parse(JSON.stringify(raw));
        if(_raw){
            return context.commit("Merge", _raw);
        }
    }
}
export default pandoraActions;