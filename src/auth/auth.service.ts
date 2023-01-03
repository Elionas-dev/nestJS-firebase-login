import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { User } from 'src/models/user.model';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  DocumentReference,
  getDoc,
  DocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';

@Injectable()
export class AuthService {
  constructor(private firebaseService: FirebaseService) {
    // we need Firebase service here
  }

  public async login(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    // Firebase logic here
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.firebaseService.auth,
        email,
        password,
      );

      if (userCredential) {
        const id: string = userCredential.user.uid;
        const docRef: DocumentReference = doc(
          this.firebaseService.usersCollection,
          id,
        );
        const snapShot: DocumentSnapshot<DocumentData> = await getDoc(docRef);
        const loggedUser: User = {
          ...snapShot.data(),
          id: snapShot.id,
        } as User;

        delete loggedUser.password;
        console.log('Login feito com sucesso');
        return loggedUser;
      }
    } catch (error: unknown) {
      console.warn(`Não foi possivel logar ${error}`);
    }
  }

  public async register(body: Omit<User, 'id'>): Promise<void> {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(
          this.firebaseService.auth,
          body.email,
          body.password,
        );

      if (userCredential) {
        const id: string = userCredential.user.uid;
        const docRef: DocumentReference = doc(
          this.firebaseService.usersCollection,
          id,
        );
        await setDoc(docRef, body);
      }
    } catch (error: unknown) {
      console.warn(`[ERROR] ${error}`);
    }
  }
}
