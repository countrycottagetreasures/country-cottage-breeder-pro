
import { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import DogMeasurements from './DogMeasurements';

export default function MyDogs({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
    const [dogs, setDogs] = useState([]);
  const [selectedDogId, setSelectedDogId] = useState(null);
  const [dogMenuOpen, setDogMenuOpen] = useState(false);

      const [name, setName] = useState('');
  const [sex, setSex] = useState('');
  const [breed, setBreed] = useState('');
  const [color, setColor] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

        useEffect(() => {
    if (!user?.uid) { setDogs([]); return; }
    return onSnapshot(
      collection(db, 'users', user.uid, 'dogs'),
      snapshot => setDogs(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))),
      error => alert('Could not load dogs: ' + error.message)
    );
  }, [user?.uid]);

  
  function newDog() {
    setEditingId(null);
    setName('');
    setSex('');
    setBreed('');
    setColor('');
    setBirthDate('');
    setRegistrationNumber('');
    setShowForm(true);
  }

  function editDog(dog) {
    setEditingId(dog.id);
    setName(dog.name || '');
    setSex(dog.sex || '');
    setBreed(dog.breed || '');
    setColor(dog.color || '');
    setBirthDate(dog.birthDate || '');
    setRegistrationNumber(dog.registrationNumber || '');
    setShowForm(true);
  }

  function cancelDog() {
    setEditingId(null);
    setShowForm(false);
  }

  async function addDog(e) {
            e.preventDefault();
                if (!name.trim()) return;

                    if (!user?.uid) { alert('Please sign in first.'); return; }
    try {
      const dogData = { name: name.trim(), sex, breed: breed.trim(), color: color.trim(), birthDate, registrationNumber: registrationNumber.trim() };
      if (editingId) {
        await updateDoc(doc(db, 'users', user.uid, 'dogs', editingId), dogData);
      } else {
        await addDoc(collection(db, 'users', user.uid, 'dogs'), dogData);
      }
    } catch (error) {
      alert('Could not save dog: ' + error.message);
      return;
    }
                        setName('');
    setSex('');
    setBreed('');
    setColor('');
    setBirthDate('');
    setRegistrationNumber('');
                            setShowForm(false);
                              }

                                return (
                                    <div style={{ padding: 20 }}>
                                          <h2>My Dogs</h2>
                                                <p>Manage your Country Cottage Poodles.</p>

                                                      <button type="button" onClick={newDog}>
                                                              + Add Dog
                                                                    </button>

                                                                          {showForm && (
                                                                                  <form onSubmit={addDog}>
                                                                                            <h3>{editingId ? 'Edit Dog' : 'Add a Dog'}</h3>
                                                                                                      <label>
                                                                                                                  Dog's Name
                                                                                                                              <input
                                                                                                                                            value={name}
                                                                                                                                                          onChange={(e) => setName(e.target.value)}
                                                                                                                                                                        required
                                                                                                                                                                                    />
                                                                                                                                                                                              </label>
                                                                                                                                                                                                        
        <label>Sex
          <select value={sex} onChange={e => setSex(e.target.value)}>
            <option value="">Select sex</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </label>
        <label>Breed
          <input value={breed} onChange={e => setBreed(e.target.value)} />
        </label>
        <label>Color
          <input value={color} onChange={e => setColor(e.target.value)} />
        </label>
        <label>Date of Birth
          <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
        </label>
        <label>Registration Number
          <input value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} />
        </label>
    <button type="submit">{editingId ? 'Save Changes' : 'Save Dog'}</button>
                                                                                                                                                                                                                  <button type="button" onClick={cancelDog}>
                                                                                                                                                                                                                              Cancel
                                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                                                                </form>
                                                                                                                                                                                                                                                      )}

                                                                                                                                                                                                                                                            
      <div style={{position:'relative', maxWidth:380, margin:'16px 0'}}>
        <button type="button"
          onClick={() => setDogMenuOpen(!dogMenuOpen)}
          style={{width:'100%', padding:12, borderRadius:10,
            background:'white', border:'1px solid #aaa',
            textAlign:'left', cursor:'pointer'}}>
          🐾 {dogs.find(d => d.id === selectedDogId)?.name || 'Select a Dog'} ▾
        </button>
        {dogMenuOpen && (
          <div style={{background:'white', border:'1px solid #ddd',
            borderRadius:10, marginTop:4, padding:6}}>
            {dogs.map(dog => {
              const photo = dog.photoUrl || dog.photoURL ||
                dog.profilePhotoUrl || dog.profilePhoto;
              return (
                <button key={dog.id} type="button"
                  onClick={() => {
                    setSelectedDogId(dog.id);
                    setDogMenuOpen(false);
                  }}
                  style={{display:'flex', alignItems:'center',
                    gap:12, padding:10, width:'100%',
                    background:'white', border:0,
                    textAlign:'left', cursor:'pointer'}}>
                  {typeof photo === 'string' && photo ? (
                    <img src={photo} alt=""
                      style={{width:32,height:32,borderRadius:'50%',
                        objectFit:'cover'}} />
                  ) : (
                    <span style={{width:32,height:32,borderRadius:'50%',
                      background:'#e8eee8',display:'grid',
                      placeItems:'center'}}>🐾</span>
                  )}
                  {dog.name}
                </button>
              );
            })}
            <button type="button" onClick={() => {
              setDogMenuOpen(false);
              newDog();
            }}>+ Add New Dog</button>
          </div>
        )}
      </div>
      {!selectedDogId && <p>Select a dog to view their profile.</p>}
{dogs.filter((dog) => dog.id === selectedDogId).map((dog) => (
                                                                                                                                                                                                                                                                    <div key={dog.id} style={{padding: 12, marginBottom: 12, border: '1px solid #ccc', borderRadius: 10}}>
  <details open>
    <summary style={{cursor: 'pointer', fontWeight: 'bold'}}>
      🐾 {dog.name}
    </summary>
    <div style={{padding: 10}}>
      <h3>Basic Information</h3>
      <p>Sex: {dog.sex || 'Not entered'}</p>
      <p>Breed: {dog.breed || 'Not entered'}</p>
      <p>Color: {dog.color || 'Not entered'}</p>
      <p>Birth Date: {dog.birthDate || 'Not entered'}</p>
      <p>Registration Number: {dog.registrationNumber || 'Not entered'}</p>
    </div>
    <DogMeasurements user={user} dog={dog} />
  </details>
  <button type="button" onClick={() => editDog(dog)}>Edit Dog</button>
</div>
                                                                                                                                                                                                                                                                          ))}
                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                