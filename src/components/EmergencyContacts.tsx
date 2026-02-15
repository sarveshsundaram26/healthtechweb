import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Phone, Trash2, Shield, AlertCircle, Loader2, Star, Pencil, X } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  is_primary: boolean;
}

export default function EmergencyContacts() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    if (!user) {
      console.log('[Emergency] No user found for fetch, skipping...');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('[Emergency] Fetching contacts for user:', user.id);
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[Emergency] Fetch error details:', error);
        throw error;
      }
      console.log('[Emergency] Contacts found:', data?.length || 0);
      setContacts(data || []);
    } catch (err: any) {
      console.error('[Emergency] Full fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user]);

  // Pre-fill form when editing
  useEffect(() => {
    if (editingContact) {
      setNewName(editingContact.name);
      setNewPhone(editingContact.phone);
      setNewRelation(editingContact.relation || '');
      setIsPrimary(editingContact.is_primary);
    } else {
      setNewName('');
      setNewPhone('');
      setNewRelation('');
      setIsPrimary(false);
    }
  }, [editingContact]);

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newName || !newPhone) return;

    setSubmitting(true);
    console.log(editingContact ? '[Emergency] Updating contact:' : '[Emergency] Adding contact:', { name: newName, phone: newPhone, relation: newRelation, isPrimary });

    try {
      // If this is set as primary, first set ALL others to false
      if (isPrimary) {
        await supabase
          .from('emergency_contacts')
          .update({ is_primary: false })
          .eq('user_id', user.id);
      }

      if (editingContact) {
        // Update existing contact
        const { error: updateError } = await supabase
          .from('emergency_contacts')
          .update({
            name: newName,
            phone: newPhone,
            relation: newRelation,
            is_primary: isPrimary
          })
          .eq('id', editingContact.id);

        if (updateError) throw updateError;
        console.log('[Emergency] Successfully updated contact');
        alert('Contact updated successfully!');
      } else {
        // Insert new contact
        const { error: insertError } = await supabase.from('emergency_contacts').insert({
          user_id: user.id,
          name: newName,
          phone: newPhone,
          relation: newRelation,
          is_primary: isPrimary
        });

        if (insertError) throw insertError;
        console.log('[Emergency] Successfully added contact');
        alert('Contact added successfully!');
      }

      setEditingContact(null);
      await fetchContacts();
    } catch (err: any) {
      console.error('[Emergency] Operation error:', err);
      const isSchemaError = err.message?.includes('schema cache') || err.message?.includes('column "is_primary" of relation "emergency_contacts" does not exist');
      alert((isSchemaError ? 'Database Sync Required: The "is_primary" column needs to be added to your emergency_contacts table. ' : '') + (err.message || 'Failed to save contact.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetPrimary = async (id: string) => {
    if (!user) return;
    try {
      // 1. Demote everyone
      await supabase
        .from('emergency_contacts')
        .update({ is_primary: false })
        .eq('user_id', user.id);
      
      // 2. Promote the target
      const { error } = await supabase
        .from('emergency_contacts')
        .update({ is_primary: true })
        .eq('id', id);

      if (error) throw error;
      await fetchContacts();
    } catch (err) {
      console.error('Error setting primary contact:', err);
      alert('Failed to set primary contact.');
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setContacts(contacts.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting contact:', err);
      alert('Failed to delete contact.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500 opacity-50" />
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="animate-fade-in-up">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-blue-400" />
          {editingContact ? 'Edit Contact' : 'Add New Contact'}
        </h3>
        <form onSubmit={handleAddContact} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <input
                type="text"
                placeholder="Ex: John Doe"
                className="w-full px-5 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium shadow-inner"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
              <input
                type="tel"
                placeholder="Ex: +1 234 567 890"
                className="w-full px-5 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium shadow-inner"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Relationship</label>
              <input
                type="text"
                placeholder="Ex: Brother, Doctor"
                className="w-full px-5 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium shadow-inner"
                value={newRelation}
                onChange={(e) => setNewRelation(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-6 pb-2">
               <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={isPrimary}
                      onChange={(e) => setIsPrimary(e.target.checked)}
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${isPrimary ? 'bg-indigo-600' : 'bg-slate-700'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isPrimary ? 'translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
                    Mark as Primary
                  </div>
               </label>

              <div className="flex-1 flex gap-3">
                {editingContact && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="h-[58px] px-6 bg-slate-700 hover:bg-slate-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-[58px] bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      {editingContact ? 'Update Contact' : 'Add Contact'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {contacts.length > 0 && !contacts.some(c => c.is_primary) && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3 animate-fade-in-up">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-amber-200/80 text-[10px] font-black uppercase tracking-widest leading-relaxed">
            SOS Reminder: No Primary Contact designated. The system will alert your most recent contact by default.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {contacts.map((contact) => (
          <div key={contact.id} className={`relative group bg-white/5 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 hover:bg-white/10 transition-all border-l-4 shadow-xl ${contact.is_primary ? 'border-l-indigo-500' : 'border-l-blue-500/50'}`}>
            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {!contact.is_primary && (
                <button
                  onClick={() => handleSetPrimary(contact.id)}
                  title="Set as Primary"
                  className="p-2 text-slate-500 hover:text-indigo-400 transition-colors bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/30"
                >
                  <Star className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => handleEdit(contact)}
                title="Edit Contact"
                className="p-2 text-slate-500 hover:text-blue-400 transition-colors bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteContact(contact.id)}
                title="Delete Contact"
                className="p-2 text-slate-500 hover:text-red-400 transition-colors bg-white/5 rounded-xl border border-white/5 hover:border-red-500/30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-start gap-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border shrink-0 transition-all ${contact.is_primary ? 'bg-indigo-500/20 border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.2)]' : 'bg-white/5 border-white/10'}`}>
                {contact.is_primary ? <Star className="h-6 w-6 text-indigo-400 fill-indigo-400/20" /> : <Shield className="h-6 w-6 text-slate-500" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white text-lg truncate">{contact.name}</p>
                  {contact.is_primary && (
                    <span className="px-2 py-0.5 bg-indigo-500 text-white text-[8px] font-black uppercase tracking-widest rounded-md shadow-lg shadow-indigo-500/20">
                      Primary
                    </span>
                  )}
                </div>
                <div className="flex items-center text-slate-400 text-sm font-medium mt-1">
                  <Phone className="h-3.5 w-3.5 mr-2 text-slate-500" />
                  {contact.phone}
                </div>
                {contact.relation && (
                  <span className="inline-block mt-3 px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 border border-white/5">
                    {contact.relation}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {contacts.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
            <AlertCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No contacts assigned</p>
            <p className="text-slate-600 text-xs mt-2">Add your first emergency contact to enable SOS alerts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
