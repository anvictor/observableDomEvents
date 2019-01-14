import {AfterViewInit, Component} from '@angular/core';
import {combineLatest, fromEvent, Observable, zip} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Observable Dom Events';


  ngAfterViewInit() {

    document.getElementById('sendBtn').setAttribute('disabled', '');
    document.getElementById('sendBtn').className = 'disabled';
    document.getElementById('mailErrMess').className = 'hidden';
    document.getElementById('passErrMess').className = 'hidden';
    document.getElementById('passReErrMess').className = 'hidden';
    // The Events Log Init
    let firstLogTitle = false;
    const outputUl = document.getElementById('output');

    const mail = document.getElementById('emailInp');
    const mailBlured = fromEvent(mail, 'blur');
    const mailValidating = mailBlured.subscribe(
      (x: any) => {
          addItem(x);
          return isMailValid(x.target.value);
          },
          (error) => addItem(error),
          () => addItem('Complited')
    );

    const pass = document.getElementById('passInp');
    const passBlured = fromEvent(pass, 'blur');
    const passValidating = passBlured.subscribe(
      (x: any) => {
        addItem(x);
        return isPassValid(x.target.value);
      },
      (error) => addItem(error),
      () => addItem('Complited')
    );

    const rePass = document.getElementById('passRepInp');
    const rePassKeyUp = fromEvent(rePass, 'keyup');
    const rePassValidating = rePassKeyUp.subscribe(
      (x: any) => {
        addItem(x);
        return x.target.value;
      },
      (error) => addItem(error),
      () => addItem('Complited')
    );

    const sendBtn = document.getElementById('sendBtn');
    const sendBtnClick = fromEvent(sendBtn, 'click');
    const subscription = sendBtnClick.subscribe((x: any) => {
        addItem(x);
        data.subscribe(
          (x1: any) => {
            alert(x1);
            document.getElementById('emailInp').setAttribute('disabled', '');
            document.getElementById('passInp').setAttribute('disabled', '');
            document.getElementById('passRepInp').setAttribute('disabled', '');
          },
          (error) => addItem(error),
          () => addItem('This is how it ends!')
        );
        // data.unsubscribe();
        mailValidating.unsubscribe();
        passValidating.unsubscribe();
        rePassValidating.unsubscribe();
        subscription.unsubscribe();

      },
      (error) => addItem(error),
      () => addItem('Complited')
    );


    const alertDataJoin = combineLatest(mailBlured, passBlured, rePassKeyUp);
let data: Observable<string>;
    alertDataJoin.subscribe(
      (x: any) => {
        if (!!isMailValid(x[0].target.value) && !!isPassValid(x[1].target.value) && !!isRePassValid(x[1].target.value, x[2].target.value)) {
          document.getElementById('sendBtn').removeAttribute('disabled');
          document.getElementById('sendBtn').className = 'enabled';
          data = Observable.create(
            (observer: any) => {
              observer.next('registration successful\n\nEMail:\n' + x[0].target.value + '\n\nPassword:\n' + x[1].target.value);
            });
          return;
        } else {
          document.getElementById('sendBtn').setAttribute('disabled', '' );
          document.getElementById('sendBtn').className = 'disabled';
          return;
        }
        },
      (error) => addItem(error),
      () => addItem('This is how it ends!')
    );


    function isMailValid(mailText: string) {
      const emailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (mailText === '') {
        document.getElementById('mailErrMess').innerText = 'can\'t be empty';
        document.getElementById('mailErrMess').className = 'visible';
        return '';
      } else if (mailText.match(emailExp)) {
        document.getElementById('mailErrMess').className = 'hidden';
        return mailText;
      } else if (!mailText.match(emailExp)) {
        document.getElementById('mailErrMess').innerText = 'wrong mail format';
        document.getElementById('mailErrMess').className = 'visible';
        return '';
      }
    }

    function isPassValid(passText: string) {
      if (passText === '') {
        document.getElementById('passErrMess').innerText = 'can\'t be empty';
        document.getElementById('passErrMess').className = 'visible';
        return '';
      } else if (passText.length < 4) {
        document.getElementById('passErrMess').innerText = 'too short password';
        document.getElementById('passErrMess').className = 'visible';
        return '';
      } else {
        document.getElementById('passErrMess').className = 'hidden';
        return passText;
      }
    }

    function isRePassValid(passText: string, rePassText: string) {
      if (rePassText !== passText) {
        document.getElementById('passReErrMess').innerText = 'password do not match';
        document.getElementById('passReErrMess').className = 'visible';
        return '';
      } else {
        document.getElementById('passReErrMess').className = 'hidden';
        return rePassText;
      }
    }

    function addItem(val: any) {

      const nodeTitle = document.createElement('li');
      const node = document.createElement('li');
      let innerText: string;
      if (!firstLogTitle) {
        nodeTitle.setAttribute('_ngcontent-c0', '');
        nodeTitle.className = 'li';
        const textnodeTitle = document.createTextNode('The Event Log:');
        nodeTitle.appendChild(textnodeTitle);
        outputUl.appendChild(nodeTitle);

        node.setAttribute('_ngcontent-c0', '');
        node.className = 'li';
        innerText = 'Event Target: ' + val.target.localName + ' #' + val.target.id;
        innerText += ' ; Event Type: ' + val.type + ' ; Value: ' + val.target.value;
        const textnode = document.createTextNode(innerText);
        node.appendChild(textnode);
        outputUl.appendChild(node);
        firstLogTitle = true;
      } else {
        node.setAttribute('_ngcontent-c0', '');
        node.className = 'li';
        innerText = 'Event Target: ' + val.target.localName + ' #' + val.target.id;
        innerText += ' ; Event Type: ' + val.type + ' ; Value: ' + val.target.value;
        const textnode = document.createTextNode(innerText);
        node.appendChild(textnode);
        outputUl.appendChild(node);
      }


    }
  }

}

