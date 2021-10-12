function main() {
  var tasks_currently_in_habitica = list_habitica_tasks('current_task_list')
  var aliases_currently_in_habitica = list_habitica_tasks('aliases')

  var aliases_currently_in_gtasks = generate_gtasks_list('list_of_ids')
  var completed_gtasks = generate_gtasks_list('completed_tasks')
  var incomplete_gtasks_formatted = generate_gtasks_list('send_to_habitica')

  // get incompleted tasks in gtasks that are not in habitica and add those
  let difference = aliases_currently_in_gtasks.filter(x => !aliases_currently_in_habitica.includes(x));
  for (const [idx, i] of difference.entries()) {
      try {
        create_task(difference[idx])
        Logger.log(difference[idx])
      } catch { 
        Logger.log("Skipping: " + difference[idx])
      } 
    }
  
  // get completed tasks in gtasks and find incomplete tasks in habitica with same alias then mark tasks in habitica as completed
  for (const [idx, i] of completed_gtasks.entries()) {
      for (const [jdx, j] of aliases_currently_in_habitica.entries()){
        if (i['alias']===j){
          mark_task_as_done(i['alias'])
          Logger.log("Marking as done: " + i['text'])
        }
      }
  }

  // update changes in due date
  for (const [idx, i] of tasks_currently_in_habitica.entries()) {
    for (const [jdx, j] of incomplete_gtasks_formatted.entries()) {
      if ((i['alias'] === j['alias']) && (i['date'] != j['date'])){
        update_task_date(j['alias'], j['date'])
        Logger.log("Updated:" + j['text'])
      }
    }
  }

}
