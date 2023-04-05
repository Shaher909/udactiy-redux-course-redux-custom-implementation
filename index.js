// APP CODE

const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'

//funcion creators

function addTodoAction(todo){
    return {
        type: ADD_TODO, 
        todo,
    }
}

function removeTodoAction(id){
    return {
        type: REMOVE_TODO,
        id,
    }
}

function toggleTodoAction(id){
    return {
        type: TOGGLE_TODO,
        id,
    }
}

function addGoalAction(goal){
    return {
        type: ADD_GOAL,
        goal,
    }
}

function removeGoalAction(id){
    return {
        type: REMOVE_GOAL,
        id,
    }
}

// a reducer function (pure function)
// state = [] to set the state to any array the first time it's called .. otherwise it is not possible concat it.
function todos(state = [], action){
    switch(action.type){
        case ADD_TODO:
            return state.concat([action.todo])
        case REMOVE_TODO:
            return state.filter((todo) => todo.id !== action.id)
        case TOGGLE_TODO:
            return state.map((todo) => todo.id !== action.id ? todo :
            Object.assign({}, todo, {complete: !todo.complete}))
        default: 
            return state
    }  
}

function goals(state = [], action){
    switch (action.type){
        case ADD_GOAL:
            return state.concat([action.goal])
        case REMOVE_GOAL:
            return state.filter((goal) => goal.id !== action.id)
        default:
            return state
    }
}

//root reducer function that is passed to the create store function containing the various reducers needed.
function app(state = {}, action){
    return {
        todos: todos(state.todos, action),
        goals: goals(state.goals, action),
    }
}

const store = createStore(app)
store.subscribe(() =>{
    console.log('the new state is: ,', store.getState())
})
 
store.dispatch(addTodoAction({
        id:0,
        name: 'Learn Redux',
        complete: false
    }
))  

//more of a library code

function createStore(reducer){

    /*
    The store should have 4 parts
    1. the state
    2. get the state
    3. listen to changes on the state
    4. update the state
    */


    // 1. the state
    let state

    // array to hold listeners to changes
    let listeners = []

    //2. get the state
    const getState = () => state
    
    // to add listeners to changes into an array 
    const subscribe = (listener) =>  {
        listeners.push(listener)
        return () => {
            listeners = listeners.filter((l) => l !==listener)
        }
    }

    //dispatch function to change the state
    const dispatch = (action) => {
        state = reducer(state, action)
        listeners.forEach((listener) => listener())
    }


    //so whever the createStore function is called the application state is returned.
    return {
        getState,
        subscribe,
        dispatch,
    }

}

/*
//3. listen to changes on the state
const store = createStore()
store.subscribe(() => {
    console.log('The new state is', store.getState())
})

const unsubscribe = store.subscribe(() => {
    console.log('The store changed')
})
*/