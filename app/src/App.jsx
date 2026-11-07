export default function App() {
    const sections = [
        'My Dogs',
            'Breeding & Litters',
                'DNA & Genetics',
                    'Pedigrees',
                        'Health & Vet Records',
                            'Vaccinations',
                                'Calendar & Reminders',
                                    'Documents'
                                      ]

                                        return (
                                            <div style={{ padding: 24, fontFamily: 'Arial', background: '#f6f4ee', minHeight: '100vh' }}>
                                                  <header style={{ background: '#365b43', color: 'white', padding: 24, borderRadius: 14 }}>
                                                          <h1>🐾 Country Cottage Breeder Pro</h1>
                                                                  <p>Dog Breeding & Health Management</p>
                                                                        </header>
                                                                              <h2>Dashboard</h2>
                                                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                                                                                            {sections.map((name) => (
                                                                                                      <div key={name} style={{ background: 'white', padding: 20, borderRadius: 12, border: '1px solid #ddd' }}>
                                                                                                                  <h3>{name}</h3>
                                                                                                                              <p>Coming soon</p>
                                                                                                                                        </div>
                                                                                                                                                ))}
                                                                                                                                                      </div>
                                                                                                                                                          </div>
                                                                                                                                                            )
                                                                                                                                                            }
