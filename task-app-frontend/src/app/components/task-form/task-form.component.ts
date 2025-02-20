import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  standalone: false
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId?: number;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [null],
      dueTime: [''],
      completed: [false]
    });
  }

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.taskId) {
      this.isEditMode = true;
      this.taskService.getTask(this.taskId).subscribe(task => {
        const date = task.dueDate ? new Date(task.dueDate) : null;
        this.taskForm.patchValue({
          ...task,
          dueDate: date,
          dueTime: date ? this.formatTime(date) : ''
        });
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const task = {
        ...formValue,
        dueDate: this.combineDateAndTime(formValue.dueDate, formValue.dueTime)
      };
      delete task.dueTime;

      if (this.isEditMode && this.taskId) {
        this.taskService.updateTask(this.taskId, task).subscribe(() => {
          this.router.navigate(['/tasks']);
        });
      } else {
        this.taskService.createTask(task).subscribe(() => {
          this.router.navigate(['/tasks']);
        });
      }
    }
  }

  private formatTime(date: Date): string {
    return date.toTimeString().substring(0, 5);
  }

  private combineDateAndTime(date: Date | null, time: string): Date | null {
    if (!date) return null;
    
    if (time) {
      const [hours, minutes] = time.split(':').map(Number);
      date.setHours(hours, minutes);
    }
    
    return date;
  }
} 