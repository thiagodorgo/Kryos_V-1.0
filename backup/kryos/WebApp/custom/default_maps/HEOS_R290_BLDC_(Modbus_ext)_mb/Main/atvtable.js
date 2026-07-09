function AtviseTable(tableElement) {
	return webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Table", { "gElement": tableElement });
}