const fs = require('fs');
function update(file){
  let s = fs.readFileSync(file,'utf8');
  s = s.replace(/const handleSaveNotImplemented = \(\) => \{[\s\S]*?\n  \};/, `const handleSaveNotImplemented = () => {
    setSaveError('');
    setSaveInfo('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };`);
  s = s.replace(/\{\/\* Info Message \*\/\}[\s\S]*?\{\/\* Error Message \*\/\}/, `{/* Info Message (maquettes) */}
        {saveInfo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-amber-700" />
            <span className="text-amber-900 font-medium">{saveInfo}</span>
          </motion.div>
        )}

        {/* Error Message */}`);
  fs.writeFileSync(file,s);
}
['src/app/pages/dashboard/VendorSettings.tsx','src/app/pages/dashboard/AdminSettings.tsx'].forEach(update);
console.log('done');
