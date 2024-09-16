

const btnAddTask = document.querySelector('.app__button--add-task');
const btnDelete = document.querySelector('.app__form-footer__button--delete');
const btnCancel = document.querySelector('.app__form-footer__button--cancel');
const btnRemoveTask = document.querySelector('#btn-remover-concluidas');
const btnRemoveAll= document.querySelector('#btn-remover-todas');


const formAddTask = document.querySelector('.app__form-add-task');
const formTextArea = document.querySelector('.app__form-textarea');
const descTarefa = document.querySelector(".app__section-active-task-description");

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

const ul = document.querySelector('.app__section-task-list'); 

function atualizarTarefas(){
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function adicionarTarefa(tarefa){
    const li = document.createElement('li');

    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `        
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
        `;

    const p = document.createElement('p');
    p.textContent = tarefa.descricao;
    p.classList.add('app__section-task-list-item-description');

    const button = document.createElement('button');
    button.classList.add('app_button-edit');

    button.onclick = () => {
        const novaDesc = prompt('Qual é o novo nome da tarefa?');

        if(novaDesc){
            p.textContent = novaDesc;
            tarefa.descricao = novaDesc;
    
            atualizarTarefas();
        }
    }

    const img = document.createElement('img');
    img.setAttribute('src', '/imagens/edit.png');

    button.append(img);

    li.append(svg);
    li.append(p);
    li.append(button);

    if(tarefa.completa){
        li.classList.add('app__section-task-list-item-complete');
        button.setAttribute('disabled', true);

    }else{
        li.onclick = () =>{
    
            document.querySelectorAll('.app__section-task-list-item-active').forEach(elemento => {
                elemento.classList.remove('app__section-task-list-item-active');
            });
    
            if(tarefaSelecionada == tarefa){
                descTarefa.textContent = '';
                tarefaSelecionada = null;
                return
            }
    
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            descTarefa.textContent = tarefa.descricao;
    
            li.classList.add('app__section-task-list-item-active');
        };

    }


    return li;
}

btnAddTask.addEventListener('click', limparForm);

btnCancel.addEventListener('click', limparForm);

function limparForm(){
    formAddTask.classList.toggle('hidden');
    
    formTextArea.value = '';
}

formAddTask.addEventListener('submit', (evento) =>{
    evento.preventDefault();

    const tarefa = {
        descricao :  formTextArea.value,
    };

    tarefas.push(tarefa);

    const elementTarefa = adicionarTarefa(tarefa);
    ul.append(elementTarefa);

    atualizarTarefas();

    formTextArea,value = '';

    formAddTask.classList.add("hidden");
});

tarefas.forEach(tarefa => {
    const elemento = adicionarTarefa(tarefa);

    ul.append(elemento);
});

document.addEventListener('FocoFinalizado', () => {
    if(tarefaSelecionada && liTarefaSelecionada){
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', true);
        tarefaSelecionada.completa = true;
        atualizarTarefas();
    }
})

const removerTarefas = (somenteCompletas) => {

    const seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';

    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    });


    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];

    atualizarTarefas()
}

btnRemoveTask.onclick = () => removerTarefas(true);
btnRemoveAll.onclick  = () => removerTarefas(false);