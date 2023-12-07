window.addEventListener('load', () => {
	const baseUrl = 'http://localhost:3000/';
	const form = document.querySelector("#new-task-form");
	const input = document.querySelector("#new-task-input");
	const list_el = document.querySelector("#tasks");

	function getTasks() {
	  
		fetch(`${baseUrl}tasks`)
		  .then(response => {
			if (!response.ok) {
			  throw new Error(`Erro: ${response.status}`);
			}
			return response.json();
		  })
		  .then(tasks => {
			console.log('Lista de tarefas:', tasks);
			tasks.forEach(task => {
                displayTask(task);
            });
		  })
		  .catch(error => {
			console.error('Error ao buscar tarefas:', error);
		  });
	  }


    function updateTask(taskId, taskDescription) {
        fetch(`${baseUrl}tasks/${taskId}`, {
			method: "PUT",
			body: JSON.stringify({
				description: taskDescription
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		})
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error atualizar tarefa:', error);
            });
    }

    function createTask(taskDescription) {
        fetch(`${baseUrl}tasks/`, {
			method: "POST",
			body: JSON.stringify({
				description: taskDescription
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		})
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro: ${response.status}`);
                }
                return response.json();
            })
			.then(task => {
				console.log('Task:', task);
					displayTask(task);
			  })
            .catch(error => {
                console.error('Erro ao criar tarefa:', error);
            });
    }

	function deleteTask(taskId) {
        fetch(`${baseUrl}tasks/${taskId}`, {
			method: "DELETE",
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		})
            .then(response => {
                if (response.status(204)) {
                    console.log('Removido com sucessso');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error ao deletar tarefa:', error);
            });
    }


	function displayTask(task) {
    	const task_el = document.createElement('div');
    	task_el.classList.add('task');

    	const task_content_el = document.createElement('div');
    	task_content_el.classList.add('content');

    	task_el.appendChild(task_content_el);

    	const task_input_el = document.createElement('input');
    	task_input_el.classList.add('text');
    	task_input_el.type = 'text';
    	task_input_el.value = task.description;
    	task_input_el.setAttribute('readonly', 'readonly');

    	task_content_el.appendChild(task_input_el);

    	const task_actions_el = document.createElement('div');
    	task_actions_el.classList.add('actions');

    	const task_edit_el = document.createElement('button');
    	task_edit_el.classList.add('edit');
    	task_edit_el.innerText = 'Editar';

    	const task_delete_el = document.createElement('button');
    	task_delete_el.classList.add('delete');
    	task_delete_el.innerText = 'Remover';

    	task_actions_el.appendChild(task_edit_el);
    	task_actions_el.appendChild(task_delete_el);

    	task_el.appendChild(task_actions_el);

    	list_el.appendChild(task_el);


		task_edit_el.addEventListener('click', (e) => {
			hanldeEdit(task_edit_el, task_input_el);
		});

		task_delete_el.addEventListener('click', (e) => {
			deleteTask(task.id);
			list_el.removeChild(task_el);
		});


		function hanldeEdit(task_edit_el, task_input_el) {
			console.log('Chegou aqui');
			if (task_edit_el.innerText.toLowerCase() == "editar") {
				task_edit_el.innerText = "Atualizar";
				task_input_el.removeAttribute("readonly");
				task_input_el.focus();
			} else {
				task_edit_el.innerText = "Editar";
				task_input_el.setAttribute("readonly", "readonly");
				const taskId = task.id;
				const taskDescription = task_input_el.value;
				updateTask(taskId, taskDescription);
			}
		}

    }
	
	  getTasks();


	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const taskDescription = input.value;

		if (taskDescription.trim() !== "") {
			createTask(taskDescription);
	
			input.value = "";
		} else {
			alert("Preencha a descrição da task");
		}
	});
});



