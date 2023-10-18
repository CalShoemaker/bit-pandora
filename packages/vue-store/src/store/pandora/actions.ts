const pandoraActions = {
    init(context:any, config:any) {
        // Ensure config data
        // config = (config.name && config.type || config.player && config.type) ? config : { name: "Player One", type:"QUICK" } ;
        const uri = "http://localhost:8081/api/";
        
        const GameOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config)
        };

        return fetch(uri, GameOptions).then(response => response.json()).then(data=>{
            context.commit("Update", data);
        });
    },
    setup(context:any, id:number){
        const uri = "http://localhost:8081/api/";
        
        const GetGameOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        };

        //const channel = new EventSource(uri + id + '/channel');
            
        return fetch(uri + id, GetGameOptions).then(res=>res.json()).then(data=>{
            context.commit("Update", data);
        });
    },
    Cast(context:any, config:any){
        const uri = "http://localhost:8081/api/";
        const { player, id, n } = config;
        const CastGameOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config)
        };

        return fetch(uri + id +"/cast", CastGameOptions).then(res=>res.json()).then(data=>{
            context.commit("Update", data);
        });
    },
    Pick(context:any, config:any){
        const uri = "http://localhost:8081/api/";
        const { player, id, solution } = config;
        const PickGameOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config)
        };

        return fetch(uri + id +"/pick", PickGameOptions).then(res=>res.json()).then(data=>{
            context.commit("Update", data);
        });
    },
    remove(context:any, n:number) {
        context.commit("Remove", n);
    },
    rollDie(context:any, n:number = 1) {
        context.commit("RollDie", n);
    },
    reset(context:any){
        context.commit("Reset");
    }
}
export default pandoraActions;