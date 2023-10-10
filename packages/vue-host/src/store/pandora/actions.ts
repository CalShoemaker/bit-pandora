const pandoraActions = {
    remove(context:any, n:number) {
        context.commit("Remove", n)
    },
    rollDie(context:any, n:number = 1) {
        context.commit("RollDie", n);
    },
    reset(context:any){
        context.commit("Reset");
    }
}

export default pandoraActions;